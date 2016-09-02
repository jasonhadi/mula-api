var mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    mkdirp = require('mkdirp'),
    moment = require('moment'),
    async = require('async'),
    PDFMerge = require('pdf-merge'),
    gm = require('gm').subClass({imageMagick: true}),
    Quixpense = require('../models/quixpense');

mongoose.set('debug', true);

function getExpense(req, res, next) {
	Quixpense.Expense.findById(req.expenseid, '-sheet').populate('receipts').exec(function (err, expense) {
		if (err) { return console.error(err); }
		else { next(expense); }     
	});
}

function getExpenses(req, res, next) {
	Quixpense.Expense.find({ userId: req.params.userid }, '-sheet', function (err, expenses) {
		if (err) { return console.error(err); }
		else { next(expenses); }     
	});
}

function deleteExpense(req, res, next) {
	Quixpense.Expense.findById(req.expenseid, '-sheet', function (err, expense) {
		if (err) {
			console.log(req.expenseid + ' was not found');
			res.status(500);
			err = new Error('ID Not Found');
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else {
			expense.remove(function (err) {
				if(err) {
					console.log(req.expenseid + ' was not found');
					res.status(500);
					err = new Error('ID Not Found');
					err.status = 500;
					res.json({message : err.status  + ' ' + err});
				} else {
					res.json({
						status: "success",
						expense: expense
					});
				}
			});
		}
	});
}

function getExpenseSheet(req, res, next) {
   	Quixpense.Expense.findById(req.expenseid, 'sheet', function (err, expense) {
		if (err) {
			console.log(expenseid + ' was not found');
			res.status(500);
			err = new Error('ID Not Found');
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else if(!expense) {
			console.log(req.expenseid + ' was not found');
			res.status(500);
			err = new Error('ID Not Found');
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else {
			next(expense);
		}
	});
}

function numberExpenses(req, res, next) {
	var activities = req.body.activities;
	var expenseId = mongoose.Types.ObjectId();
	var userId = req.params.userid;

	Quixpense.Activity.update({_id: { $in: activities.map(mongoose.Types.ObjectId)}}, { row: [] }, { multi: true } , function(err) {
		Quixpense.Receipt.find({parentActivity: { $in: activities.map(mongoose.Types.ObjectId)}}, '-img')
		.sort({ parentActivity: 1 })
		.lean()
		.exec(function(err, receipts) {
			var currentSheet = 1;
			var currentActivity = 0;
			var currentActivityId = "";
			var receiptNumber = 1;
			var oldestBillDate = moment();
			var activitySave = false;
			var activityArray = [];

			async.each(receipts,
				function(receipt, callback) {
					if(currentActivityId != receipt.parentActivity) {
						currentActivity++;
						activitySave = true;
						currentActivityId = receipt.parentActivity;
						activityArray.push(receipt.parentActivity);
					}
					if(receiptNumber % 28 === 0 || currentActivity > 5) {
						currentSheet++;
						currentActivity = 1;
						activitySave = true;
					} 
					if(oldestBillDate.isAfter(receipt.date)) oldestBillDate = moment(receipt.date);

					if(activitySave) {
						activitySave = false;

						Quixpense.Activity.findById(currentActivityId, function (err, activity) {
							activity.row.push({
								sheetNumber: currentSheet,
								number: currentActivity
							});
							activity.parentExpense = expenseId;
							activity.save(function(err) {
								Quixpense.Receipt.findById(receipt._id, '-img', function (err, receipt) {
									console.log('RN:::::::::' + receiptNumber);
									receipt.sheetNumber = currentSheet;
									receipt.receiptNumber = receiptNumber;
									receipt.activityNumber = currentActivity;
									receipt.parentExpense = expenseId;
									receipt.save(function(err) {
										callback();	
									});
									receiptNumber++;
								});
							});
						});
					} else {
						Quixpense.Receipt.findById(receipt._id, '-img', function (err, receipt) {
							console.log('RN:::::::::' + receiptNumber);
							receipt.sheetNumber = currentSheet;
							receipt.receiptNumber = receiptNumber;
							receipt.activityNumber = currentActivity;
							receipt.parentExpense = expenseId;
							receipt.save(function(err) {
								callback();	
							});
							receiptNumber++;
						});
					}

				}, function(err) {
					Quixpense.Activity.find({parentExpense: expenseId}, function(err, activities) {
						generateExpense(expenseId, userId, receipts, activities, next);
					});
				}
		);
		});

	});
}

function generateExpense(expenseId, userId, newReceipts, newActivities, next) {
	Quixpense.Expense.create({
		_id: expenseId
	}, function(err, expense) {
		if(err) { console.log('sss'); }
		Quixpense.Expense.findByIdAndUpdate(expenseId, {$push: {receipts: {$each: newReceipts}, activities: {$each: newActivities}}}, function(err, exp) {
			if(err) { console.log('aaa'); }
			generateExpensePdf(expenseId, userId, next);
		});
	});
}

function generateExpensePdf(expenseId, userId, next) {
	console.log("batchimages");
	var path = './uploads/' + expenseId;
	var pdfs = [];

	mkdirp(path, function(err) {
		if(err) { }
		else {	
			Quixpense.Receipt.find({ parentExpense: expenseId })
					 .sort({ receiptNumber: 1 })
					 .exec(function (err, receipts) {
						async.each(receipts,
							function(receipt, callback) {
								var img64 = receipt.img.data;
								var img = new Buffer(img64, 'base64');
								var fn = path + "/" + receipt.receiptNumber + ".pdf";
								gm(img)
									.font("Courier-Bold")
									.gravity("North")
									.fontSize("50")
									.drawText(0, 100, "RECEIPT " + receipt.receiptNumber)
									.write(fn, function (err) {
										if(err) { console.log(err); }	
										pdfs.push(fn);
										callback();
									});
							},
							function(err) {
								console.log("combinepdf");
								var pdfm = new PDFMerge(pdfs.sort());
								pdfm.merge(function(err, outpdf) {
									if(err) {
										console.log('error combine');       	
									}
									else {
										Quixpense.Expense.findById(expenseId, function(err, expense) {
											expense.sheet = { data: outpdf, contentType: 'application/pdf' }; 
											expense.userId = userId;
											expense.save(function(err) {
												expense.sheet = undefined;
												next(expense);	
											});
										});
									}
								});
							}
						);
					});
		}
	});
}

function verifyExpenseId(req, res, next, expenseid) {
	mongoose.model('Expense').findById(expenseid, function (err, expense) {
		if (err) {
			console.log('Expense ' + expenseid + ' was not found');
			res.status(500);
			err = new Error('Expense ID Not Found');
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else {
			console.log(expense);
			req.expenseid = expenseid;
			next(); 
		} 
	});
}

module.exports = {
	getExpense: getExpense,
	getExpenses: getExpenses,
	deleteExpense: deleteExpense,
	getExpenseSheet: getExpenseSheet,
	numberExpenses: numberExpenses,
	verifyExpenseId: verifyExpenseId
};
