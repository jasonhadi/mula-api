var mongoose = require('mongoose'), //mongo connection
    fs = require('fs'),
    gm = require('gm').subClass({imageMagick: true}),
    multer = require('multer'), 
    uploads = multer({ dest: './uploads/' }),
    Quixpense = require('../models/quixpense');

function newReceipt(req, res, next) {
	var imageId = mongoose.Types.ObjectId();
	var data = fs.readFileSync(req.file.path);
	var contentType = req.file.mimetype;

	var receiptId = mongoose.Types.ObjectId();
	var expenseId = req.body.expenseId;
	var activityId = req.body.activityId;
	var imgId = req.body.imgId;
	var description = req.body.description;
	var where = req.body.where;
	var type = req.body.type;
    	var amount = req.body.amount;
	var created = req.body.created;
	var lastUpdated = req.body.lastUpdated;

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
				Quixpense.Image.create({
					_id: imageId,
					parentReceipt: receiptId,
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
					} 
				});

				Quixpense.Receipt.create({
					_id: receiptId,
					where: where,
					type: type,
					amount: amount,
					imgId: imageId,
				}, function (err, receipt) {
					next(receipt);
				});
			}
		});
}

function updateReceipt(req, res, next) {
	var userid = req.params.userid;
	var receiptid = req.params.receiptid;

	console.log('yo update');
	console.log(JSON.stringify(req.body));

	Quixpense.Receipt.findById(receiptid, function (err, receipt) {
		if (err) {
			console.log(err);
			console.log(receiptid + ' was not found');
			res.status(500);
			err = new Error('ID Not Found');
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else if(!receipt) {
			console.log('new receipt');
			newReceipt(req,res,next);
		} else {
			if(req.file) { 
				var imageId = mongoose.Types.ObjectId();
				var data = fs.readFileSync(req.file.path);
				var contentType = req.file.mimetype;

				console.log('save image');

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
							Quixpense.Image.create({
								_id: imageId,
								parentReceipt: receiptid,
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
									receipt.imgId = imageId;
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
					});
			}
			
			if(req.body.expenseId) receipt.expenseId = req.body.expenseId;
			if(req.body.activityId) receipt.activityId = req.body.activityId;
			if(req.body.description) receipt.description = req.body.description;
			if(req.body.where) receipt.where = req.body.where;
			if(req.body.type) receipt.type = req.body.type;
    			if(req.body.amount) receipt.amount = req.body.amount;
			if(req.body.created) receipt.created = req.body.created;
			if(req.body.lastUpdated) receipt.lastUpdated = req.body.lastUpdated;

			receipt.save(function(err) {
				if (err) {
					console.log(id + ' was not found');
					res.status(404);
					err = new Error('User Not Found');
					err.status = 404;
					return res.json({message : err.status  + ' ' + err});
				} else { return next(receipt); }
			});
		}
	});
}

function getReceipts(req, res, next) {
	Quixpense.Receipt.find({ userId: req.params.userid }, function (err, receipts) {
			if (err) { return console.error(err); }
			else { next(receipts); }     
	});
}

function verifyReceiptId(req, res, next, receiptid) {
	Quixpense.Receipt.findById(receiptid, function (err, receipt) {
		if (err) {
			console.log(receiptid + ' was not found');
			res.status(500);
			err = new Error('ID Not Found');
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else {
			req.receiptid = receiptid;
			next(); 
		} 
	});
}

function getReceipt(req, res, next) {
	Quixpense.Receipt.findById(req.params.receiptid, function (err, receipt) {
		if (err) {
			console.log(receiptid + ' was not found');
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
	Quixpense.Receipt.findById(req.params.receiptid, function (err, receipt) {
		if (err) {
			console.log(receiptid + ' was not found');
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
	var receiptid = req.params.receiptid;
   	Quixpense.Image.findOne({ parentReceipt: receiptid }, function (err, image) {
		if (err) {
			console.log(receiptid + ' was not found');
			res.status(500);
			err = new Error('ID Not Found');
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else {
			next(image);
		}
	});
}

module.exports = {
	getReceipts: getReceipts,
	newReceipt: newReceipt,
	verifyReceiptId: verifyReceiptId,
	updateReceipt: updateReceipt,
	getReceipt: getReceipt,
	getReceiptImg: getReceiptImg
};

//	newReceiptImg: function(req, res, next) {
//		var data = fs.readFileSync(req.file.path);
//		var contentType = req.file.mimetype;
//
//		gm(data, req.file.filename + ".jpg")
//			.page(647, 792)
//			.toBuffer('PDF', function (err, pdf) {
//				if(err) {
//					console.log("Could not convert image to pdf!");
//					res.status(500);
//					err = new Error("Could not covnert image to pdf!");
//					err.status = 500;
//					res.json({message : err.status  + ' ' + err});
//				} else { 
//					Quixpense.Image.create({
//						img: {
//							data: pdf,
//						contentType: 'application/pdf'
//						}
//					}, function (err, image) {
//						if(err) {
//							console.log("Could not create Image!");
//							res.status(500);
//							err = new Error("Could not create Image!");
//							err.status = 500;
//							res.json({message : err.status  + ' ' + err});
//						} else {
//							next(image);							
//						}
//					});
//				}
//			});
//
//	},
//
//	verifyReceiptImgId: function(req, res, next, id) {
//		console.log(id);
//		Quixpense.Image.findById(id, function (err, image) {
//			if (err) {
//				console.log(id + ' was not found');
//				res.status(404);
//				err = new Error('ID Not Found');
//				err.status = 404;
//				res.json({message : err.status  + ' ' + err});
//			} else {
//				req.id = id;
//				next(); 
//			} 
//		});
//	},
//


