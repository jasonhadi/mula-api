var express = require('express'),
    router = express.Router(),
    userController = require('../controllers/users');

var config = require('../config');
var jwt = require('jsonwebtoken');

module.exports = function(passport) {
	router.post('/', function(req, res) {
		passport.authenticate('ldapauth', {session: false})(req, res, function(err) {
			if (err) { return res.status(500).json(err); }
			if (!req.user) { return res.status(401).json({ status: 'error', code: 'UNAUTHORIZED' }); } 
			else { 
				userController.getUserByUsername(req.user.sAMAccountName, function(user) {
					var userObj = {
						id: user._id,
						username: req.user.sAMAccountName,
						firstname: req.user.givenName,
						lastname: req.user.sn,
						email: req.user.mail,
						expCurrency: user.expCurrency,
						reimbCurrency: user.reimbCurrency
					};
					return res.json({ token: jwt.sign(userObj, config.jwtsecret) }); 
				});
			}
		});
	});
	return router;
};
