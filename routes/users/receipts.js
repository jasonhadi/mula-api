var express = require('express'),
    session = require('express-session'),
    router = express.Router({mergeParams: true}),
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    fs = require('fs'),
    gm = require('gm').subClass({imageMagick: true}),
    multer = require('multer'),
    uploads = multer({ dest: './uploads/' }),
    receiptController = require('../../controllers/receipts');


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
    .post(uploads.single('img'), function(req, res) {
	    receiptController.newReceipt(req, res, function(receipt) {
		res.json(receipt);	    
	    });
    });

router.get('/new', function(req, res) {
    res.render('receipts/new', { title: 'Add new receipt' });
});
router.get('/:receiptid/new', function(req, res) {
    res.render('receipts/new', { title: 'Add new receipt' });
});

//router.param('receiptid', function(req, res, next, receiptid) {
//    receiptController.verifyReceiptId(req, res, next, receiptid);
//});

router.route('/:receiptid')
  .get(function(req, res) {
	  receiptController.getReceipt(req, res, function(receipt) {
		  res.json(receipt);	    
	  });
  })
  .post(uploads.single('img'), function(req, res) { //change back to put after testing
	  receiptController.updateReceipt(req, res, function(receipt) {
		  res.json(receipt);	    
	  });
  })
  .delete(function(req, res) {
	  receiptController.deleteReceipt(req, res, function(receipt) {
		  res.json(receipt);	    
	  });
  });

router.route('/:receiptid/img')
  .get(function(req, res) {
	  receiptController.getReceiptImg(req, res, function(image) {
		  var img64 = image.img.data;
		  var img = new Buffer(img64, 'base64');

		  res.writeHead(200, {
			  'Content-Type': image.img.contentType,
			  'Content-Length': img.length
		  });
		  res.end(img);
	  });
  });

module.exports = router;
