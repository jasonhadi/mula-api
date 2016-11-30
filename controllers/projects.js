var mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    Quixpense = require('../models/quixpense');

function getProjects(req, res, next) {
	Quixpense.Project.find({ userId: req.user.id }, function (err, projects) {
		if (err) { return console.error(err); }
		else { next(projects); }     
	});
}

function getProject(req, res, next) {
	Quixpense.Project.findById(req.projectid, function (err, project) {
		if (err) { return console.error(err); }
		else { next(project); }     
	});
}

function newProject(req, res, next) {
	var userId = req.user.id;
	var assignment = req.body.assignment;
	var clientName = req.body.clientName;
	var name = req.body.name;
	var description = req.body.description;

	Quixpense.Project.create({
		userId: userId,
		assignment: assignment,
		clientName: clientName,
		name: name,
		description: description,
	}, function (err, project) {
		if(err) {
			console.log("Could not create Project!");
			res.status(500);
			err = new Error("Could not create Project!");
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else {
			console.log( JSON.stringify(project) );
			return next(project);
		}
	});
}

function verifyProjectId(req, res, next, projectid) {
	mongoose.model('Project').findById(projectid, function (err, project) {
		if (err || !project) {
			console.log(id + ' was not found');
			res.status(404);
			err = new Error('ID Not Found');
			err.status = 404;
			res.json({message : err.status  + ' ' + err});
		} else {
			console.log(project);
			req.projectid = projectid;
			next(); 
		} 
	});
}

function updateProject(req, res, next) {
	Quixpense.Project.findById(req.projectid, function (err, project) {
		if (err) { 
			console.log(req.projectid + ' was not found');
			res.status(404);
			err = new Error('ID Not Found');
			err.status = 404;
			res.json({message : err.status  + ' ' + err});
		} else if(!project) {
			return newProject(req, res, next);
		}
		else { 
			if(req.body.userId) project.userId = req.body.userId;
			if(req.body.assignment) project.assignment = req.body.assignment;
			if(req.body.clientName) project.clientName = req.body.clientName;
			if(req.body.name) project.project = req.body.name;
			if(req.body.description) project.description = req.body.description;

			project.save(function(err) {
				if (err) {
					console.log(id + ' was not found');
					res.status(404);
					err = new Error('User Not Found');
					err.status = 404;
					return res.json({message : err.status  + ' ' + err});
				} else { 
					return next(project); 
				}
			});
	       	}     
	});
}

function deleteProject(req, res, next) {
	Quixpense.Project.findById(req.projectid, function (err, project) {
		if (err) {
			console.log(req.projectid + ' was not found');
			res.status(500);
			err = new Error('ID Not Found');
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else {
			project.remove(function (err) {
				if(err) {
					console.log(req.projectid + ' was not found');
					res.status(500);
					err = new Error('ID Not Found');
					err.status = 500;
					res.json({message : err.status  + ' ' + err});
				} else {
					res.json({
						status: "success",
						project: project
					});
				}
			});
		}
	});
}

module.exports = {
	getProjects: getProjects, 
	newProject: newProject,
	getProject: getProject,
	updateProject: updateProject,
	deleteProject: deleteProject,
	verifyProjectId: verifyProjectId
};


