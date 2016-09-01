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

function getActivity(req, res, next) {
	Quixpense.Activity.findById(req.activityid, function (err, activity) {
		if (err) { return console.error(err); }
		else { next(activity); }     
	});
}

function newActivity(req, res, next) {
	var userId = req.params.userid;
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
			return next(activity);
		}
	});
}

function verifyActivityId(req, res, next, activityid) {
	mongoose.model('Activity').findById(activityid, function (err, activity) {
		if (err || !activity) {
			console.log(id + ' was not found');
			res.status(404);
			err = new Error('ID Not Found');
			err.status = 404;
			res.json({message : err.status  + ' ' + err});
		} else {
			console.log(activity);
			req.activityid = activityid;
			next(); 
		} 
	});
}

function updateActivity(req, res, next) {
	Quixpense.Activity.findById(req.activityid, function (err, activity) {
		if (err) { 
			console.log(req.activityid + ' was not found');
			res.status(404);
			err = new Error('ID Not Found');
			err.status = 404;
			res.json({message : err.status  + ' ' + err});
		} else if(!activity) {
			return newActivity(req, res, next);
		}
		else { 
			if(req.body.userId) activity.userId = req.body.userId;
			if(req.body.type) activity.type = req.body.type;
			if(req.body.clientName) activity.clientName = req.body.clientName;
			if(req.body.project) activity.project = req.body.project;
			if(req.body.description) activity.description = req.body.description;

			activity.save(function(err) {
				if (err) {
					console.log(id + ' was not found');
					res.status(404);
					err = new Error('User Not Found');
					err.status = 404;
					return res.json({message : err.status  + ' ' + err});
				} else { 
					return next(activity); 
				}
			});
	       	}     
	});
}

function deleteActivity(req, res, next) {
	Quixpense.Activity.findById(req.activityid, function (err, activity) {
		if (err) {
			console.log(req.activityid + ' was not found');
			res.status(500);
			err = new Error('ID Not Found');
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else {
			activity.remove(function (err) {
				if(err) {
					console.log(req.activityid + ' was not found');
					res.status(500);
					err = new Error('ID Not Found');
					err.status = 500;
					res.json({message : err.status  + ' ' + err});
				} else {
					res.json({
						status: "success",
						activity: activity
					});
				}
			});
		}
	});
}

module.exports = {
	getActivities: getActivities, 
	newActivity: newActivity,
	getActivity: getActivity,
	updateActivity: updateActivity,
	deleteActivity: deleteActivity,
	verifyActivityId: verifyActivityId
};


