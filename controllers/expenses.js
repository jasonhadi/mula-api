var mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    js2xmlparser = require('js2xmlparser'),
    mkdirp = require('mkdirp'),
    PDFMerge = require('pdf-merge'),
    gm = require('gm').subClass({imageMagick: true});

mongoose.set('debug', true);

var sheetReceiptRowsCount = 27;
var sheetActivityRowsCount = 5;

var calculateSheets = function(expenseId, next) {
	console.log("calculatesheets");
	mongoose.model('Expense').findById(expenseId, function (err, expense) {
		var activities = expense.activities;
	
		var receiptNumber = 1;
		var currentActivity = 1;
		var currentSheet = 1;
		var oldestBillDate = "";

		for(var i = 0; i < activities.length; i++) {
			var receipts = activities[i].receipts;

			//If the activity number exceeds 5, start a new sheet, reset activity number
			if(currentActivity > 5) {
				currentSheet++;
				currentActivity = 1;
			}

			//Add activity number to db
			activities[i].row.push({
				sheetNumber: currentSheet,
				number: currentActivity
			});
			setActivitySheet(activities[i].id, currentSheet, currentActivity);

			for(var j = 0; j < receipts.length; j++) {
				//If receipt fits on sheet, proceed normally
				//Otherewise, start new sheet, reset activity number and push to acitivity, then proceed
				if(receiptNumber % 28 === 0) {
					currentSheet++;
					currentActivity = 1;

					activities[i].row.push({
						sheetNumber: currentSheet,
						number: currentActivity
					});
					setActivitySheet(activities[i].id, currentSheet, currentActivity);
				}

				receipts[j].sheetNumber = currentSheet;
				receipts[j].number = receiptNumber;
				receipts[j].activity = currentActivity;	
				setReceiptSheet(receipts[j].id, currentSheet, receiptNumber, i );

				receiptNumber++;
			}
			currentActivity++;

		}

		expense.sheetCount = currentSheet;
		expense.save( batchImages(expenseId, expense.sheetCount, next) );
	});
};

var setActivitySheet = function (activityId, sheetNumber, number) {
	mongoose.model('Activity').findById(activityId, function (err, activity) {
		activity.row.push({
			sheetNumber: sheetNumber,
			number: number
		});
		activity.save();
	});
};

var setReceiptSheet = function( receiptId, sheetNumber, number, activity) {
	console.log("setreceiptsheet");
	mongoose.model('Receipt').findById(receiptId, function (err, receipt) {
		receipt.sheetNumber = sheetNumber;
		receipt.number = number;
		receipt.activity = activity;
		receipt.save();
	});
};

var batchImages = function(expenseId, sheetNumber, next) {
	console.log("batchimages");
	var path = './uploads/' + expenseId;
	var pdfs = [];

	mkdirp(path, function(err) {
		if(err) { }
		else {	
			mongoose.model('Receipt').find({ parentExpense: expenseId, sheetNumber: sheetNumber }, null, { sort: { number: 1 } }, function (err, receipts) {
				console.log( JSON.stringify(receipts) );
				for(var i = 0; i < receipts.length; i++ ) {
					labelImage(expenseId, receipts[i].imgId, receipts[i].number, sheetNumber, path, pdfs, receipts.length, combinePdf, next);
				}	
			});
		}
	});
};

var combinePdf = function(pdfs, expenseId, sheetNumber, next) {
	console.log("combinepdf");
	var pdfm = new PDFMerge(pdfs.sort());
	pdfm.merge(function(err, outpdf) {
		if(err) { }
		else {
			mongoose.model('Image').create({
				img: {
					data: outpdf,
					contentType: 'application/pdf',
				}, 
				parentExpense: expenseId,
				sheetNumber: sheetNumber,
				combined: true
			}, function (err, image) {
				if(err) {
					console.log("Could not create Image!");
					res.status(500);
					err = new Error("Could not create Image!");
					err.status = 500;
					res.json({message : err.status  + ' ' + err});
				} else {

					next(image);							
				}
			});

		}	
	});
};

var labelImage = function(expenseId, imgId, receiptNumber, sheetNumber, path, pdfs, receiptCount, combinePdf, next) {
	console.log("labelimage");
	console.log("LI: " + imgId);
	mongoose.model('Image').findById(imgId, function (err, image) {
		if(err) {  }
		else {
			var img64 = image.img.data;
			var img = new Buffer(img64, 'base64');
			var fn = path + "/" + sheetNumber + "-" + receiptNumber + ".pdf";

			gm(img)
				.font("Courier-Bold")
				.gravity("North")
				.fontSize("50")
	       			.drawText(0, 100, "RECEIPT " + receiptNumber)
				.write(fn, function (err) {
					if(err) { console.log(err); }	
					pdfs.push(fn);
					if(receiptCount	== pdfs.length) {
						combinePdf(pdfs, expenseId, sheetNumber, next);
						image.parentExpense = expenseId;
						image.sheetNumber = sheetNumber;
						image.save();
					}
				});
		}	
	});	
};

var clearExports = function(expenseId, cs, next) {
	console.log('clearexports');
	mongoose.model('Image').find({ combined: true}, function(err, images) {
		if (err) throw err;
		console.log("CE: " + images.length);
		for(var i = 0; i < images.length; i++ ) {
			images[i].remove();	
		}

		cs(expenseId, next);
	});
};


module.exports = {
	getExpenses: function(req, res, next) {
	        mongoose.model('Expense').find({}, function (err, expenses) {
	              if (err) { return console.error(err); }
		      else { next(expenses); }     
	        });
	},
	
	newExpense: function(req, res, next) {
		console.log( JSON.stringify(req.body) );
		var name = req.body.name;
	    	var username = req.body.username;
		var submitDate = req.body.submitDate;
	    	var expCurrency = req.body.expCurrency;
		var reimbCurrency = req.body.reimbCurrency;
		var oldestBillDate = req.body.oldestBillDate;
	
	        mongoose.model('Expense').create({
			name : name,
			username : username,
			submitDate : submitDate,
			expCurrency : expCurrency,
			reimbCurrency : reimbCurrency,
			oldestBillDate : oldestBillDate
	        }, function (err, expense) {
	              if (err) {
	                  res.send("There was a problem adding the information to the database.");
	              } else {
	                  console.log('POST creating new expense: ' + expense);
			  next(expense);
	              }
	        });
	},
	
	verifyExpenseId: function(req, res, next, id) {
	    mongoose.model('Expense').findById(id, function (err, expense) {
	        if (err) {
	            console.log('Expense ' + id + ' was not found');
	            res.status(500);
	            err = new Error('Expense ID Not Found');
	            err.status = 500;
		    res.json({message : err.status  + ' ' + err});
	        } else {
	            console.log(expense);
	            req.id = id;
	            next(); 
	        } 
	    });
	},
	
	getExpenseById: function(req, res, next) {
	    mongoose.model('Expense').findById(req.id, function (err, expense) {
	      if (err) {
	        console.log('GET Error: There was a problem retrieving: ' + err);
	      } else {
	        console.log('GET Retrieving ID: ' + expense._id);
		next(expense);
	      }
	    });
	},

	exportExpense: function(req, res, next) {
		clearExports(req.id, calculateSheets, next);
	},

	exportExpenseXml: function( req, res, next) {
	    mongoose.model('Expense').findById(req.id).exec( function (err, expense) {
	      if (err) {
	        console.log('GET Error: There was a problem retrieving: ' + err);
	      } else {
	        console.log('GET Retrieving ID: ' + expense._id);
		var xml = js2xmlparser('expensesheet', JSON.stringify(expense));
		console.log(xml);
		next( xml );
	      }
	    });
	}
};
