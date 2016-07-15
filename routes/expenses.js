var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

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
    .get(function(req, res, next) {
        mongoose.model('Expense').find({}, function (err, expenses) {
              if (err) { return console.error(err); }
	      else { res.json(expenses); }     
        });
    })
    .post(function(req, res) {
	var name = req.body.name;
    	var username = req.body.username;
	var submitDate = req.body.submitDate;
    	var expCurrency = req.body.expCurrency;
	var reimbCurrency = req.body.reimbCurrency;
	var oldestBillDate = req.body.oldestBillDate;
	var created = req.body.created;
	var lastUpdated = req.body.lastUpdated;

        mongoose.model('Expense').create({
		name : name,
		username : username,
		submitDate : submitDate,
		expCurrency : expCurrency,
		reimbCurrency : reimbCurrency,
		oldestBillDate : oldestBillDate,
		created : created,
		lastUpdated : lastUpdated
        }, function (err, expense) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  console.log('POST creating new expense: ' + expense);
		  res.json(expense);
              }
        });
    });

router.get('/new', function(req, res) {
    res.render('expenses/new', { title: 'Add new expense' });
});

router.param('id', function(req, res, next, id) {
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
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Expense').findById(req.id, function (err, expense) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + expense._id);
	res.json(expense);
      }
    });
  });



module.exports = router;
