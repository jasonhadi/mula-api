var mongoose = require('mongoose'), //mongo connection
    mkdirp = require('mkdirp'),
    moment = require('moment'),
    async = require('async'),
    PDFMerge = require('pdf-merge'),
    gm = require('gm').subClass({imageMagick: true}),
    Quixpense = require('../models/quixpense');

function getExpense(req, res, next) {
	Quixpense.Expense.findById(req.expenseid, '-sheet').populate('receipts').exec(function (err, expense) {
		if (err) { return console.error(err); }
		else { next(expense); }     
	});
}

function getExpenses(req, res, next) {
	Quixpense.Expense.find({ userId: req.user.id }, '-sheet', function (err, expenses) {
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
	var projects = req.body.projects;
	var expenseId = mongoose.Types.ObjectId();
	var userId = req.user.id;

	Quixpense.Project.update({_id: { $in: projects.map(mongoose.Types.ObjectId)}}, { row: [] }, { multi: true } , function(err) {
		Quixpense.Receipt.find({parentProject: { $in: projects.map(mongoose.Types.ObjectId)}}, '-img')
		.sort({ parentProject: 1 })
		.lean()
		.exec(function(err, receipts) {
			var currentSheet = 1;
			var currentProject = 0;
			var currentProjectId = "";
			var receiptNumber = 1;
			var oldestBillDate = moment();
			var projectSave = false;
			var receiptArray = [];

			async.eachSeries(receipts,
				function(receipt, callback) {
					if(currentProjectId.toString() != receipt.parentProject.toString()) {
						currentProject++;
						projectSave = true;
						currentProjectId = receipt.parentProject;
					}
					if(receiptNumber % 28 === 0 || currentProject > 5) {
						currentSheet++;
						currentProject = 1;
						projectSave = true;
					} 
					if(oldestBillDate.isAfter(receipt.date)) oldestBillDate = moment(receipt.date);

					if(projectSave) {
						projectSave = false;

						Quixpense.Project.findById(currentProjectId, function (err, project) {
							project.row.push({
								sheetNumber: currentSheet,
								number: currentProject
							});
							project.parentExpense = expenseId;
							project.save(function(err) {
								Quixpense.Receipt.findById(receipt._id, '-img', function (err, receipt) {
									receipt.sheetNumber = currentSheet;
									receipt.receiptNumber = receiptNumber;
									receipt.projectNumber = currentProject;
									receipt.parentExpense = expenseId;
									receipt.save(function(err,receipt) {
										receiptArray.push(receipt);
										callback();	
									});
									receiptNumber++;
								});
							});
						});
					} else {
						Quixpense.Receipt.findById(receipt._id, '-img', function (err, receipt) {
							receipt.sheetNumber = currentSheet;
							receipt.receiptNumber = receiptNumber;
							receipt.projectNumber = currentProject;
							receipt.parentExpense = expenseId;
							receipt.save(function(err, receipt) {
								receiptArray.push(receipt);
								callback();	
							});
							receiptNumber++;
						});
					}

				}, function(err) {
					var params = {
						fullname: req.user.firstname + ' ' + req.user.lastname,
						expCurrency: req.user.expCurrency,
						reimbCurrency: req.user.reimbCurrency,
						oldestBillDate: oldestBillDate
					};

					Quixpense.Project.find({parentExpense: expenseId}, function(err, projects) {
						generateExpense(expenseId, userId, receiptArray, projects, params, next);
					});
				}
		);
		});

	});
}

function generateExpense(expenseId, userId, newReceipts, newProjects, params, next) {
	Quixpense.Expense.create({
		_id: expenseId,
		fullname: params.fullname,
		expCurrency: params.expCurrency,
		reimbCurrency: params.reimbCurrency,
		oldestBillDate: params.oldestBillDate
	}, function(err, expense) {
		if(err) { console.log('sss'); }
		Quixpense.Expense.findByIdAndUpdate(expenseId, {$push: {receipts: {$each: newReceipts}, projects: {$each: newProjects}}}, function(err, exp) {
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
	Quixpense.Expense.findById(expenseid, function (err, expense) {
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
