var mongoose = require('mongoose');
var Quixpense = require('../models/quixpense');

function newUser(req, res, next) {
	var username = req.body.username;
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

function verifyUser(req, res, next, username) {
	Quixpense.User.findOne({ 'username': username }, function(err, user) {
		if (err) {
			console.log(id + ' was not found');
			res.status(404);
			err = new Error('User Not Found');
			err.status = 404;
			return res.json({message : err.status  + ' ' + err});
		} else {
			req.username = username;
			return next(); 
		} 

	});	
}

function getUser(req, res, next) {
	var username = req.username;
	Quixpense.User.findOne({ 'username': username }, function(err, user) {
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

module.exports = {
	newUser: newUser,
	verifyUser: verifyUser,
	getUser: getUser
};
