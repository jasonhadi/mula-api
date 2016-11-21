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

function verifyUser(req, res, next, userid) {
	Quixpense.User.findOne({ _id: userid }, function(err, user) {
		if (err) {
			console.log(id + ' was not found');
			res.status(500);
			err = new Error('User Not Found');
			err.status = 500;
			return res.json({message : err.status  + ' ' + err});
		} else {
			req.userid = userid;
			return next(); 
		} 

	});	
}

function getUser(req, res, next) {
	var userid = req.userid;
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

function updateUser(req, res, next) {
	var userid = req.userid;

	Quixpense.User.findOne({ _id: userid }, function(err, user) {
		if (err) {
			console.log(userid + ' was not found');
			res.status(500);
			err = new Error('User Not Found');
			err.status = 500;
			return res.json({message : err.status  + ' ' + err});
		} else {
			if (req.body.username) user.username = req.body.username;
			if (req.body.displayName) user.displayName = req.body.displayName;
			if (req.body.expCurrency) user.expCurrency = req.body.expCurrency;
			if (req.body.reimbCurrency) user.reimbCurrency = req.body.reimbCurrency;
			if (req.body.email) user.email = req.body.email;
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
				} else { return next(user); }
			});
		} 

	});	
}

module.exports = {
	newUser: newUser,
	verifyUser: verifyUser,
	getUser: getUser,
	updateUser: updateUser
};
