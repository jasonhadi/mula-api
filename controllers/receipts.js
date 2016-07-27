var mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST    fs = require('fs'),
    fs = require('fs'),
    gm = require('gm').subClass({imageMagick: true}),
    multer = require('multer');

var uploads = multer({
  dest: './uploads/'
});


module.exports = {
	getReceipts: function(req, res, next) {
		mongoose.model('Receipt').find({}, function (err, receipts) {
			if (err) { return console.error(err); }
			else { next(receipts); }     
		});
	},

	newReceipt: function(req, res, next) {
		var expenseId = req.body.expenseId;
		var activityId = req.body.activityId;
		var imgId = req.body.imgId;
		var description = req.body.description;
		var where = req.body.where;
		var type = req.body.type;
	    	var amount = req.body.amount;
		var created = req.body.created;
		var lastUpdated = req.body.lastUpdated;
	
		
	        mongoose.model('Expense').findById(expenseId, function (err, expense) {
			if (err) {
				console.log(id + ' was not found');
				res.status(500);
				err = new Error('ID Not Found');
				err.status = 500;
				res.json({message : err.status  + ' ' + err});
			}
		       	else {
				mongoose.model('Receipt').create({
					where: where,
					type: type,
					amount: amount,
					imgId: imgId,
					parentActivity: activityId,
					parentExpense: expenseId
				}, function (err, receipt) {
					var activity = expense.activities.id(activityId);
					activity.receipts.push(receipt);
					activity.lastUpdated = new Date();
					expense.lastUpdated = new Date();
					expense.receiptCount = expense.receiptCount + 1;
					expense.save();
					next(expense);
				});
			}
		});
	},


	newReceiptImg: function(req, res, next) {
		var data = fs.readFileSync(req.file.path);
		var contentType = req.file.mimetype;

		gm(data, req.file.filename + ".jpg")
			.page(647, 792)
			.toBuffer('PDF', function (err, pdf) {
				if(err) {
					console.log("Could not convert image to pdf!");
					res.status(500);
					err = new Error("Could not covnert image to pdf!");
					err.status = 500;
					res.json({message : err.status  + ' ' + err});
				} else { 
					mongoose.model('Image').create({
						img: {
							data: pdf,
						contentType: 'application/pdf'
						}
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

	},

	verifyReceiptImgId: function(req, res, next, id) {
		console.log(id);
		mongoose.model('Image').findById(id, function (err, image) {
			if (err) {
				console.log(id + ' was not found');
				res.status(404);
				err = new Error('ID Not Found');
				err.status = 404;
				res.json({message : err.status  + ' ' + err});
			} else {
				req.id = id;
				next(); 
			} 
		});
	},

	getReceiptImgById: function(req, res, next) { 
	   	mongoose.model('Image').findById(req.id, function (err, image) {
			if (err) {
				console.log('GET Error: There was a problem retrieving: ' + err);
			} else {
				next(image);
			}
		});
	},

	verifyReceiptId: function(req, res, next, id) {
		console.log(id);
		mongoose.model('Receipt').findById(id, function (err, receipt) {
			if (err) {
				console.log(id + ' was not found');
				res.status(404);
				err = new Error('ID Not Found');
				err.status = 404;
				res.json({message : err.status  + ' ' + err});
			} else {
				console.log(receipt);
				req.id = id;
				next(); 
			} 
		});
	},

	getReceiptById: function(req, res, next) {
		mongoose.model('Receipt').findById(req.id, function (err, receipt) {
			if (err) {
				console.log('GET Error: There was a problem retrieving: ' + err);
			} else {
				console.log('GET Retrieving ID: ' + receipt._id);
				next(receipt);
			}
		});
	}
};


