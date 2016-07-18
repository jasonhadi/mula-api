var mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST


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
	}
};
