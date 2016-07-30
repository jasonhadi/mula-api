var express = require('express'),
    session = require('express-session'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    fs = require('fs'),
    gm = require('gm').subClass({imageMagick: true}),
    multer = require('multer'),
    receiptController = require('../controllers/receipts');

var uploads = multer({
  dest: './uploads/'
});

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
    .get(function(req, res) {
	    receiptController.getReceipts(req, res, function(receipts) {
		res.json(receipts);	    
	    });
    })
    .post(function(req, res) {
	    receiptController.newReceipt(req, res, function(receipt) {
		res.json(receipt);	    
	    });
    });

router.get('/new', function(req, res) {
    res.render('receipts/new', { title: 'Add new receipt' });
});

router.route('/img')
    .get(function(req, res) {
	    res.render('receipts/newimg', { title: 'Add new image' });
    })
    .post(uploads.single('img'), function(req, res) { 
	  receiptController.newReceiptImg(req, res, function(image) {
		  var img64 = image.img.data;
		  var img = new Buffer(img64, 'base64');

		  res.writeHead(200, {
			  'Content-Type': image.img.contentType,
			  'Content-Length': img.length
		  });
		  res.end(img);
	  });
    });

router.get('/img/new', function(req, res) {
    res.render('receipts/newimg', { title: 'Add new image' });
});

router.param('img_id', function(req, res, next, id) {
	receiptController.verifyReceiptImgId(req, res, next, id);
});

router.route('/img/:img_id')
   .get(function(req, res) {
	  receiptController.getReceiptImgById(req, res, function(image) {
		  var img64 = image.img.data;
		  var img = new Buffer(img64, 'base64');

		  res.writeHead(200, {
			  'Content-Type': image.img.contentType,
			  'Content-Length': img.length
		  });
		  res.end(img);
	  });
   });

router.param('id', function(req, res, next, id) {
    receiptController.verifyReceiptId(req, res, next, id);
});

router.route('/:id')
  .get(function(req, res) {
	  receiptController.getReceiptById(req, res, function(receipt) {
		  res.json(receipt);	    
	  });
  });


module.exports = router;
