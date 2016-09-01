var mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    Quixpense = require('../models/quixpense');

function getActivities(req, res, next) {
	Quixpense.Activity.find({ userId: req.params.userid }, function (err, activities) {
		if (err) { return console.error(err); }
		else { next(activities); }     
	});
}

function newActivity(req, res, next) {
	var userId = req.body.userId;
	var type = req.body.type;
	var clientName = req.body.clientName;
	var project = req.body.project;
	var description = req.body.description;

	Quixpense.Activity.create({
		userId: userId,
		type: type,
		clientName: clientName,
		project: project,
		description: description,
	}, function (err, activity) {
		if(err) {
			console.log("Could not create Activity!");
			res.status(500);
			err = new Error("Could not create Activity!");
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else {
			console.log( JSON.stringify(activity) );
			next(activity);
		}
	});
}

module.exports = {
	getActivities: getActivities, 
	newActivity: newActivity,

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


