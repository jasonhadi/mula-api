var mongoose = require('mongoose'); //mongo connection
var Quixpense = require('../models/quixpense');

function newUser(req, res, next) {
	var username = req.body.username;
	var displayName = req.body.displayName;
	var expCurrency = req.body.expCurrency;
	var reimbCurrency = req.body.reimbCurrency;
	var email = req.body.email;
	var isCorporateCard = req.body.isCorporateCard;
	var cardType = req.body.cardType;
	var bankType = req.body.bankType;

	Quixpense.User.create({
		username: username, 
		displayName: displayName, 
		email: email, 
		expCurrency: expCurrency,
		reimbCurrency: reimbCurrency, 
		isCorporateCard: isCorporateCard,
		cardType: cardType,
		bankType: bankType
	}, function(err, user) {
		if(err) {
			console.log("Could not create user!");
			res.status(500);
			err = new Error("Could not create user!");
			err.status = 500;
			return res.json({message : err.status  + ' ' + err});
		} else {
			return next(user);
		}
	});
}

function getUser(req, res, next) {
	var userid = req.user.id;
	Quixpense.User.findOne({ _id: userid }, function(err, user) {
		if(err) {
			console.log("Could not find user!");
			res.status(500);
			err = new Error("Could not find user!");
			err.status = 500;
			return res.json({message : err.status  + ' ' + err});
		} else {
			return next(user);
		}

	});
}

function getUserByUsername(username, next) {
	Quixpense.User.findOne({ username: username }, function(err, user) {
		if(err) {
			console.log("Could not find user!");
			res.status(500);
			err = new Error("Could not find user!");
			err.status = 500;
			return res.json({message : err.status  + ' ' + err});
		} else {
			return next(user);
		}

	});
}

function updateUser(req, res, next) {
	var userid = req.user.id;

	Quixpense.User.findOne({ _id: userid }, function(err, user) {
		if (err) {
			console.log(userid + ' was not found');
			res.status(500);
			err = new Error('User Not Found');
			err.status = 500;
			return res.json({message : err.status  + ' ' + err});
		} else {
			if (req.body.expCurrency) user.expCurrency = req.body.expCurrency;
			if (req.body.reimbCurrency) user.reimbCurrency = req.body.reimbCurrency;
			if (req.body.isCorporateCard) user.isCorporateCard = req.body.isCorporateCard;
			if (req.body.cardType) user.cardType = req.body.cardType;
			if (req.body.bankType) user.bankType = req.body.bankType;

			user.save(function(err) {
				if (err) {
					console.log(id + ' was not found');
					res.status(404);
					err = new Error('User Not Found');
					err.status = 404;
					return res.json({message : err.status  + ' ' + err});
				} else { 
					userObj = {
						id: req.user.id,
						username: req.user.username,
						firstname: req.user.firstname,
						lastname: req.user.lastname,
						email: req.user.email,
						expCurrency: user.expCurrency,
						reimbCurrency: user.reimbCurrency
					};
					return next(userObj); 
				}
			});
		} 

	});	
}

function submitFeedback(req, res, next) {
	var userid = req.user.id;
	var fullname = req.user.firstname + ' ' + req.user.lastname;
	var feedback = req.body.feedback;

	Quixpense.Feedback.create({
		username: userid, 
		fullname: fullname,
		feedback: feedback
	}, function(err, feedback) {
		if(err) {
			err = new Error("Could not create user!");
			err.status = 500;
			return res.status(500).json({message : err.status  + ' ' + err});
		} else {
			return next(feedback);
		}
	});

}

module.exports = {
	newUser: newUser,
	getUser: getUser,
	getUserByUsername: getUserByUsername,
	updateUser: updateUser,
	submitFeedback: submitFeedback
};
