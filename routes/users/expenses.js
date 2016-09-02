var express = require('express'),
    session = require('express-session'),
    router = express.Router({mergeParams: true}),
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    expenseController = require('../../controllers/expenses');

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
	    expenseController.numberExpenses(req, res, function(expenses) {
		res.json(expenses);	    
	    });
    });

router.param('expenseid', function(req, res, next, expenseid) {
	expenseController.verifyExpenseId(req, res, next, expenseid);
});

router.route('/:expenseid')
    .get(function(req, res) {
	    expenseController.getExpense(req, res, function(expense) {
		res.json(expense);	    
	    });
    })
    .delete(function(req, res) {
	    expenseController.deleteExpense(req, res, function(expense) {
		res.json(expense);	    
	    });
    });

router.route('/:expenseid/pdf')
  .get(function(req, res) {
	  expenseController.getExpenseSheet(req, res, function(expense) {
		  var img64 = expense.sheet.data;
		  var img = new Buffer(img64, 'base64');

		  res.writeHead(200, {
			  'Content-Type': expense.sheet.contentType,
			  'Content-Length': img.length
		  });
		  res.end(img);
	  });
  });

module.exports = router;
