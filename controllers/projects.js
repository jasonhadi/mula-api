var mongoose = require('mongoose'), //mongo connection
    async = require('async'),
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
			return next(project);
		}
	});
}

function verifyProjectId(req, res, next, projectid) {
	mongoose.model('Project').findById(projectid, function (err, project) {
		if (err || !project) {
			res.status(500).json({message : '500 Project not found.'});
		} else {
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
			if(req.body.assignment) project.assignment = req.body.assignment;
			if(req.body.clientName) project.clientName = req.body.clientName;
			if(req.body.name) project.name = req.body.name;
			if(req.body.description) project.description = req.body.description;
			//TODO: Refresh lastUpdated

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

function getReceipts(req, res, next) {
	Quixpense.Receipt.find({ userId: req.user.id, parentProject: req.projectid, submitted: false }, '-img -submitted -__v', function (err, receipts) {
		if (err) { return console.error(err); }
		else { next(receipts); }     
	});
}

function batchCreate(req, res, next) {
	Quixpense.Project.create(req.body.projects, function(err, projects) {
		if(err) { return next(err); }
		else {
			return next({
				count: projects.length,
				projects: projects,
				status: 'success'
			});
		}
	});
}

function batchDelete(req, res, next) {
	Quixpense.Project.remove({_id: {$in: req.body.projects}}, function(err, r) {
		if(err) { return next(err); }
		else {
			return next({
				count: r.result.n,
				status: 'success'
			});
		}
	});
}

function batchUpdate(req, res, next) {
	async.each(req.body.projects, function(p, callback) {
		Quixpense.Project.findOneAndUpdate({_id: p._id}, {$set: p}, function(err, project) {
			if(err) { callback(err); }
			else { callback(); }
		});
	}, function(err) {
		if(err) { return next(err); }
		else {
			return next({
				count: req.body.projects.length,
				status: 'success'
			});
		}
	});
}


module.exports = {
	getProjects: getProjects, 
	newProject: newProject,
	getProject: getProject,
	getReceipts: getReceipts,
	updateProject: updateProject,
	deleteProject: deleteProject,
	batchCreate: batchCreate,
	batchDelete: batchDelete,
	batchUpdate: batchUpdate,
	verifyProjectId: verifyProjectId
};


