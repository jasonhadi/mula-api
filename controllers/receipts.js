var mongoose = require('mongoose'), //mongo connection
    fs = require('fs'),
    gm = require('gm').subClass({imageMagick: true}),
    multer = require('multer'), 
    uploads = multer({ dest: './uploads/' }),
    Quixpense = require('../models/quixpense');

function newReceipt(req, res, next) {
	var userid = req.user.id;

	var data = fs.readFileSync(req.file.path);
	var contentType = req.file.mimetype;

	var receiptId = mongoose.Types.ObjectId();
	var parentProject = req.body.parentProject;
	var where = req.body.where;
	var type = req.body.type;
    	var amount = req.body.amount;
	var date = req.body.date;
	var description = req.body.description;

	gm(data, req.file.filename + ".jpg")
		.page(647, 792)
		.toBuffer('PDF', function (err, pdf) {
			if(err) {
				err = new Error("Could not convert image to pdf!");
				err.status = 500;
				res.status(500).json({message : err.status  + ' ' + err});
			} else { 
				Quixpense.Receipt.create({
					_id: receiptId,
					userId: userid,
					parentProject: parentProject,
					where: where,
					type: type,
					amount: amount,
					date: date,
					description: description,
					img: {
						data: pdf,
						contentType: 'application/pdf'
					}

				}, function (err, receipt) {
					receipt.img = undefined;
					next(receipt);
				});
			}
		});
}

function updateReceipt(req, res, next) {
	var userid = req.user.id;
	var receiptid = req.params.receiptid;

	Quixpense.Receipt.findById(receiptid, function (err, receipt) {
		if (err) {
			console.log(err);
			console.log(receiptid + ' was not found');
			res.status(500);
			err = new Error('ID Not Found');
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else if(!receipt) {
			newReceipt(req,res,next);
		} else {
			if(req.file) { 
				var data = fs.readFileSync(req.file.path);
				var contentType = req.file.mimetype;

				gm(data, req.file.filename + ".jpg")
					.page(647, 792)
					.toBuffer('PDF', function (err, pdf) {
						if(err) {
							console.log("Could not convert image to pdf!");
							res.status(500);
							err = new Error("Could not convert image to pdf!");
							err.status = 500;
							res.json({message : err.status  + ' ' + err});
						} else { 
							receipt.img = { data: pdf, contentType: 'application/pdf' };
							receipt.save(function(err) {
								if (err) {
									console.log(id + ' was not found');
									res.status(404);
									err = new Error('User Not Found');
									err.status = 404;
									return res.json({message : err.status  + ' ' + err});
								}
								console.log('save update image');
							});
						}
					});
			}
			
			if(req.body.expenseId) receipt.expenseId = req.body.expenseId;
			if(req.body.projectId) receipt.projectId = req.body.projectId;
			if(req.body.description) receipt.description = req.body.description;
			if(req.body.where) receipt.where = req.body.where;
			if(req.body.type) receipt.type = req.body.type;
    			if(req.body.amount) receipt.amount = req.body.amount;
			if(req.body.created) receipt.created = req.body.created;
			if(req.body.lastUpdated) receipt.lastUpdated = req.body.lastUpdated;
			if(req.body.parentProject) receipt.parentProject = req.body.parentProject;

			receipt.save(function(err) {
				if (err) {
					console.log(id + ' was not found');
					res.status(404);
					err = new Error('User Not Found');
					err.status = 404;
					return res.json({message : err.status  + ' ' + err});
				} else { 
					receipt.img = undefined;
					return next(receipt); 
				}
			});
		}
	});
}

function getReceipts(req, res, next) {
	Quixpense.Receipt.find({ userId: req.user.id }, '-img', function (err, receipts) {
			if (err) { return console.error(err); }
			else { next(receipts); }     
	});
}

function getReceipt(req, res, next) {
	Quixpense.Receipt.findById(req.params.receiptid, '-img', function (err, receipt) {
		if (err) {
			console.log(req.params.receiptid + ' was not found');
			res.status(500);
			err = new Error('ID Not Found');
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else if(!receipt) {
			console.log(req.params.receiptid + ' was not found');
			res.status(500);
			err = new Error('ID Not Found');
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else {
			next(receipt);
		}
	});
}

function deleteReceipt(req, res, next) {
	Quixpense.Receipt.findById(req.params.receiptid, '-img', function (err, receipt) {
		if (err) {
			console.log(receiptid + ' was not found');
			res.status(500);
			err = new Error('ID Not Found');
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else if(!receipt) {
			console.log(req.params.receiptid + ' was not found');
			res.status(500);
			err = new Error('ID Not Found');
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else {
			receipt.remove(function (err) {
				if(err) {
					console.log(receiptid + ' was not found');
					res.status(500);
					err = new Error('ID Not Found');
					err.status = 500;
					res.json({message : err.status  + ' ' + err});
				} else {
					res.json({
						status: "success",
						receipt: receipt
					});
				}
			});
		}
	});
}

function getReceiptImg(req, res, next) { 
   	Quixpense.Receipt.findById(req.params.receiptid, 'img', function (err, receipt) {
		if (err) {
			console.log(receiptid + ' was not found');
			res.status(500);
			err = new Error('ID Not Found');
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else if(!receipt) {
			console.log(req.params.receiptid + ' was not found');
			res.status(500);
			err = new Error('ID Not Found');
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else {
			next(receipt);
		}
	});
}

module.exports = {
	newReceipt: newReceipt,
	getReceipt: getReceipt,
	getReceipts: getReceipts,
	getReceiptImg: getReceiptImg,
	updateReceipt: updateReceipt,
	deleteReceipt: deleteReceipt
};
