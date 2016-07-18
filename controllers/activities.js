var mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST


module.exports = {
	getActivities: function(req, res, next) {
		mongoose.model('Activity').find({}, function (err, activities) {
			if (err) { return console.error(err); }
			else { next(activities); }     
		});
	},

	newActivity: function(req, res, next) {
		var expenseId = req.body.expenseId;
		var type = req.body.type;
		var clientName = req.body.clientName;
		var project = req.body.project;
		var description = req.body.description;
		var created = req.body.created;
		var lastUpdated = req.body.lastUpdated;

		mongoose.model('Expense').findById(expenseId, function (err, expense) {
			console.log( JSON.stringify(expense) );
			if (err) { 
				console.log('Expense ' + expenseId + ' was not found');
				res.status(500);
				err = new Error('Expense ID Not Found');
				err.status = 500;
				res.json({message : err.status  + ' ' + err});
			} else {
				mongoose.model('Activity').create({
					type: type,
					clientName: clientName,
					project: project,
					description: description,
					parentExpense: expenseId,
					created: created,
					lastUpdated: lastUpdated
				}, function (err, activity) {
					if(err) {
						console.log("Could not create Activity!");
						res.status(500);
						err = new Error("Could not create Activity!");
						err.status = 500;
						res.json({message : err.status  + ' ' + err});
					} else {
						console.log( JSON.stringify(activity) );
						expense.activities.push(activity);
						expense.lastUpdated = new Date();
						expense.save(function (err) {
							if (err) {
								console.log("Could not save expense!");
								res.status(500);
								err = new Error("Could not save expense!");
								err.status = 500;
								res.json({message : err.status  + ' ' + err});
							} else {
								res.json(expense);
							}
						});
					}
				});

			}

		});
	},

	verifyActivityId: function(req, res, next, id) {
		console.log(id);
		mongoose.model('Activity').findById(id, function (err, activity) {
			if (err) {
				console.log(id + ' was not found');
				res.status(404);
				err = new Error('ID Not Found');
				err.status = 404;
				res.json({message : err.status  + ' ' + err});
			} else {
				console.log(activity);
				req.id = id;
				next(); 
			} 
		});
	},

	getActivityById: function(req, res, next) {
		mongoose.model('Activity').findById(req.id, function (err, activity) {
			if (err) {
				console.log('GET Error: There was a problem retrieving: ' + err);
			} else {
				console.log('GET Retrieving ID: ' + activity._id);
				next(activity);
			}
		});
	}
};


