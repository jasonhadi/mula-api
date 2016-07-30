var express = require('express'),
    session = require('express-session'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    expenseController = require('../controllers/expenses');

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
	    expenseController.getExpenses(req, res, function(expenses) {
		res.json(expenses);	    
	    });
    })
    .post(function(req, res) {
	    expenseController.newExpense(req, res, function(expense) {
		res.json(expense);	    
	    });
    });

router.get('/new', function(req, res) {
    res.render('expenses/new', { title: 'Add new expense' });
});

router.param('id', function(req, res, next, id) {
	expenseController.verifyExpenseId(req, res, next, id);
});

router.route('/export/:id')
    .get(function(req, res) {
	    expenseController.exportExpense(req, res, function(image) {
		  var img64 = image.img.data;
		  var img = new Buffer(img64, 'base64');

		  res.writeHead(200, {
			  'Content-Type': image.img.contentType,
			  'Content-Length': img.length
		  });
		  res.end(img);
	    });
    });

router.route('/xml/:id')
    .get(function(req, res) {
	    expenseController.exportExpenseXml(req, res, function(xml) {
		res.header('Content-Type', 'text/xml').send(xml);
	    });
    });

router.route('/:id')
    .get(function(req, res) {
	    expenseController.getExpenseById(req, res, function(expense) {
		res.json(expense);	    
	    });
    });

module.exports = router;
