var express = require('express'),
    router = express.Router(),
    session = require('express-session'),
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    multer = require('multer'),
    uploads = multer({ dest: './uploads/' }),
    receiptController = require('../controllers/receipts');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
      }
}));

router.route('/')
/**
 * @api {get} /receipts Get all Receipts 
 * @apiGroup Receipts
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiSuccess {Object[]} receipts Array list of Receipts for the User.
 * @apiSuccess {ObjectId} receipts._id ID of the Receipt.
 * @apiSuccess {ObjectId} receipts.userId The User which created this Receipt.
 * @apiSuccess {ObjectId} receipts.parentProject The Project ID which this Receipt is categorized under.
 * @apiSuccess {String} receipts.type Type of Receipt.
 * @apiSuccess {String="O","U","Can HST", "Can GST"} receipts.where Location code of Receipt.
 * @apiSuccess {Number} receipts.amount Value of Receipt.
 * @apiSuccess {String} [receipts.description] Description of Receipt.
 * @apiSuccess {Date} receipts.created Creation date of the Receipt.
 * @apiSuccess {Date} receipts.created Creation date of the Receipt.
 * @apiSuccess {Date} receipts.date Date marked on Receipt.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * [
 *	{
 *		"_id": "57c8704c2f4ac8860450e8a8",
 *		"userId": "57c5ed60cb9c234842d4d61f",
 *		"where": "O",
 *		"type": "Taxi",
 *		"amount": 20.52,
 *		"parentProject": "57c86ff12f4ac8860450e8a6",
 *		"lastUpdated": "2016-09-01T18:15:41.130Z",
 *		"created": "2016-09-01T18:15:41.130Z",
 *		"date": "2016-09-01T20:50:23.676Z",
 *	}
 * ]
 */
    .get(function(req, res) {
	    receiptController.getReceipts(req, res, function(receipts) {
		res.json(receipts);	    
	    });
    })
/**
 * @api {post} /receipts Create new Receipt 
 * @apiGroup Receipts
 * @apiDescription The encoding for this POST is multipart/formdata to handle the image upload.
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {ObjectId} [parentProject] Project ID of the related Project.
 * @apiParam {String} [description] Description of the Receipt.
 * @apiParam {String="O","U","Can HST", "Can GST"} where Location code of Receipt.
 * @apiParam {String} type Type of the Receipt.
 * @apiParam {Number} amount Amount of the Receipt.
 * @apiParam {Date} date Date of the Receipt.
 * @apiParam {String} description Description of the Receipt.
 * @apiParam {File} img Image file of the Receipt.
 * @apiParamExample {json} Content Example:
 * {
 * 	"userId": "57c5ed60cb9c234842d4d61f",
 * 	"parentAcitivty": "57c86ff12f4ac8860450e8a6",
 * 	"description": "Lunch with Bob",
 * 	"date": "2016/12/01",
 * 	"where": "O",
 * 	"type": "Meals & Entertainment",
 * 	"img": [some binary data],
 * 	"amount": 80.52
 * }
 * @apiSuccess {ObjectId} _id ID of the Receipt.
 * @apiSuccess {ObjectId} userId The User which created this Receipt.
 * @apiSuccess {ObjectId} parentProject The Project ID which this Receipt is categorized under.
 * @apiSuccess {String} type Type of Receipt.
 * @apiSuccess {Number} amount Value of Receipt.
 * @apiSuccess {String} [description] Description of Receipt.
 * @apiSuccess {Date} created Creation date of the Receipt.
 * @apiSuccess {Date} created Creation date of the Receipt.
 * @apiSuccess {Date} date Date marked on Receipt.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 * 	"_id": "57c8704c2f4ac8860450e8a8",
 * 	"userId": "57c5ed60cb9c234842d4d61f",
 * 	"where": "O",
 * 	"type": "Meals & Entertainment",
 * 	"amount": 80.52,
 * 	"description": "Lunch with Bob",
 * 	"parentProject": "57c86ff12f4ac8860450e8a6",
 * 	"lastUpdated": "2016-09-01T18:15:41.130Z",
 * 	"created": "2016-09-01T18:15:41.130Z",
 * 	"date": "2016-09-01T20:50:23.676Z",
 * }
 */
    .post(uploads.single('img'), function(req, res) {
	    receiptController.newReceipt(req, res, function(receipt) {
		res.json(receipt);	    
	    });
    });

/**
 * @api {get} /receipts/uncategorized Get all uncategorized Receipts 
 * @apiGroup Receipts
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiSuccess {Object[]} receipts Array list of Receipts for the User.
 * @apiSuccess {ObjectId} receipts._id ID of the Receipt.
 * @apiSuccess {ObjectId} receipts.userId The User which created this Receipt.
 * @apiSuccess {String} receipts.type Type of Receipt.
 * @apiSuccess {String="O","U","Can HST", "Can GST"} receipts.where Location code of Receipt.
 * @apiSuccess {Number} receipts.amount Value of Receipt.
 * @apiSuccess {String} [receipts.description] Description of Receipt.
 * @apiSuccess {Date} receipts.created Creation date of the Receipt.
 * @apiSuccess {Date} receipts.created Creation date of the Receipt.
 * @apiSuccess {Date} receipts.date Date marked on Receipt.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * [
 *	{
 *		"_id": "57c8704c2f4ac8860450e8a8",
 *		"userId": "57c5ed60cb9c234842d4d61f",
 *		"where": "O",
 *		"type": "Taxi",
 *		"amount": 20.52,
 *		"lastUpdated": "2016-09-01T18:15:41.130Z",
 *		"created": "2016-09-01T18:15:41.130Z",
 *		"date": "2016-09-01T20:50:23.676Z",
 *	}
 * ]
 */
router.get('/uncategorized', function(req, res) {
	receiptController.getUncategorized(req, res, function(receipts) {
		res.json(receipts);	    
	});
});

router.route('/:receiptid')
/**
 * @api {get} /receipts/:receiptid Get Receipt by ID
 * @apiGroup Receipts
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {ObjectId} receiptid Receipt ID of the Receipt.
 * @apiSuccess {ObjectId} _id ID of the Receipt.
 * @apiSuccess {ObjectId} userId The User which created this Receipt.
 * @apiSuccess {ObjectId} parentProject The Project ID which this Receipt is categorized under.
 * @apiSuccess {String} type Type of Receipt.
 * @apiSuccess {Number} amount Value of Receipt.
 * @apiSuccess {String} [description] Description of Receipt.
 * @apiSuccess {Date} created Creation date of the Receipt.
 * @apiSuccess {Date} created Creation date of the Receipt.
 * @apiSuccess {Date} date Date marked on Receipt.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 * 	"_id": "57c8704c2f4ac8860450e8a8",
 * 	"userId": "57c5ed60cb9c234842d4d61f",
 * 	"where": "O",
 * 	"type": "Taxi",
 * 	"amount": 20.52,
 * 	"parentProject": "57c86ff12f4ac8860450e8a6",
 * 	"lastUpdated": "2016-09-01T18:15:41.130Z",
 * 	"created": "2016-09-01T18:15:41.130Z",
 * 	"date": "2016-09-01T20:50:23.676Z",
 * }
 */
  .get(function(req, res) {
	  receiptController.getReceipt(req, res, function(receipt) {
		  res.json(receipt);	    
	  });
  })
  .post(uploads.single('img'), function(req, res) { 
	  receiptController.updateReceipt(req, res, function(receipt) {
		  res.json(receipt);	    
	  });
  })
/**
 * @api {post} /receipts/:receiptid Update Receipt by ID
 * @apiGroup Receipts
 * @apiDescription The encoding for this POST is multipart/formdata to handle the image upload.
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {ObjectId} receiptid Receipt ID of the related Receipt.
 * @apiParam {ObjectId} [projectId] Project ID of the related Project.
 * @apiParam {String} [description] Description of the Receipt.
 * @apiParam {String="O","U","Can HST", "Can GST"} [where] Location code of Receipt.
 * @apiParam {String} [type] Type of the Receipt.
 * @apiParam {Number} [amount] Amount of the Receipt.
 * @apiParam {File} [img] Image file of the Receipt.
 * @apiParamExample {json} Content Example:
 * {
 * 	"description": "Lunch with Alice",
 * 	"where": "O",
 * 	"amount": 281.52
 * }
 * @apiSuccess {ObjectId} _id ID of the Receipt.
 * @apiSuccess {ObjectId} userId The User which created this Receipt.
 * @apiSuccess {ObjectId} parentProject The Project ID which this Receipt is categorized under.
 * @apiSuccess {String} type Type of Receipt.
 * @apiSuccess {Number} amount Value of Receipt.
 * @apiSuccess {String} [description] Description of Receipt.
 * @apiSuccess {Date} created Creation date of the Receipt.
 * @apiSuccess {Date} created Creation date of the Receipt.
 * @apiSuccess {Date} date Date marked on Receipt.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 * 	"_id": "57c8704c2f4ac8860450e8a8",
 * 	"userId": "57c5ed60cb9c234842d4d61f",
 * 	"where": "O",
 * 	"type": "Meals & Entertainment",
 * 	"amount": 281.52,
 * 	"description": "Lunch with Alice",
 * 	"parentProject": "57c86ff12f4ac8860450e8a6",
 * 	"lastUpdated": "2016-09-01T18:15:41.130Z",
 * 	"created": "2016-09-01T18:15:41.130Z",
 * 	"date": "2016-09-01T20:50:23.676Z",
 * }
 */
  .put(uploads.single('img'), function(req, res) { 
	  receiptController.updateReceipt(req, res, function(receipt) {
		  res.json(receipt);	    
	  });
  })
/**
 * @api {delete} /receipts/:receiptid Delete Receipt by ID
 * @apiGroup Receipts
 * @apiDescription The encoding for this POST is multipart/formdata to handle the image upload.
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {ObjectId} receiptid Receipt ID of the related Receipt.
 * @apiSuccess {String="success","failed"} status Status of the DELETE action.
 * @apiSuccess {Object[]} receipt.Details of the delete Receipt.
 * @apiSuccess {ObjectId} receipt._id ID of the Receipt.
 * @apiSuccess {ObjectId} receipt.userId The User which created this Receipt.
 * @apiSuccess {ObjectId} receipt.parentProject The Project ID which this Receipt is categorized under.
 * @apiSuccess {String} receipt.type Type of Receipt.
 * @apiSuccess {String="O","U","Can HST", "Can GST"} receipt.where Location code of Receipt.
 * @apiSuccess {Number} receipt.amount Value of Receipt.
 * @apiSuccess {String} [receipt.description] Description of Receipt.
 * @apiSuccess {Date} receipt.created Creation date of the Receipt.
 * @apiSuccess {Date} receipt.created Creation date of the Receipt.
 * @apiSuccess {Date} receipt.date Date marked on Receipt.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 *	status: "success",
 *	receipt: {
 *		"_id": "57c8704c2f4ac8860450e8a8",
 *		"userId": "57c5ed60cb9c234842d4d61f",
 *		"where": "O",
 *		"type": "Taxi",
 *		"amount": 20.52,
 *		"parentProject": "57c86ff12f4ac8860450e8a6",
 *		"lastUpdated": "2016-09-01T18:15:41.130Z",
 *		"created": "2016-09-01T18:15:41.130Z",
 *		"date": "2016-09-01T20:50:23.676Z",
 *	}
 * }
 */
  .delete(function(req, res) {
	  receiptController.deleteReceipt(req, res, function(receipt) {
		  res.json(receipt);	    
	  });
  });

router.route('/:receiptid/pdf')
  .get(function(req, res) {
	  receiptController.getReceiptImg(req, res, function(receipt) {
		  var img64 = receipt.img.data;
		  var img = new Buffer(img64, 'base64');

		  res.writeHead(200, {
			  'Content-Type': receipt.img.contentType,
			  'Content-Length': img.length
		  });
		  res.end(img);
	  });
  });

router.route('/:receiptid/img')
  .get(function(req, res) {
	  receiptController.getReceiptImg(req, res, function(receipt) {
		  var img64 = receipt.img.imgdata;
		  var img = new Buffer(img64, 'base64');

		  res.writeHead(200, {
			  'Content-Type': receipt.img.mimetype,
			  'Content-Length': img.length
		  });
		  res.end(img);
	  });
  });


module.exports = router;
