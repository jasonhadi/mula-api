var express = require('express'),
    router = express.Router(),
    userController = require('../controllers/users');

var config = require('../config');
var jwt = require('jsonwebtoken');
/**
 * @api {post} /auth Get authentication token
 * @apiGroup Authentication
 * @apiHeader {String} Content-Type=application/json Also accepts x-www-form-urlencoded.
 * @apiParam {String} username Username of User.
 * @apiParam {String} password Password of User.
 * @apiParamExample {json} Content Example:
 * {
 * 	"username": "jdoe",
 * 	"password": "hunter2"
 * }
 * @apiSuccess {String} token Authentication token for the User.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 * 	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3YzVlZDYwY2I5YzIzNDg0MmQ0ZDYxZiIsInVzZXJuYW1lIjoiamhhZGkiLCJmaXJzdG5hbWUiOiJKYXNvbiIsImxhc3RuYW1lIjoiSGFkaSIsImVtYWlsIjoiamhhZGlAcmxzb2x1dGlvbnMuY29tIiwiZXhwQ3VycmVuY3kiOiJDQUQiLCJyZWltYkN4cnJlbmN7IjoiQ1FEIiwiaWF1IjoxNDgwMzUyMTI5fQ.QYfFYAnB3CPUbN7VJ1gt9SFvChxQbqRteIbJk1fqAbU"
 * }
 */

/**
 * @api {get} /auth Authentication token usage
 * @apiGroup Authentication
 * @apiHeader {String} Authorization Set value to Bearer $token.
 * @apiHeaderExample Header Example:
 * Authorization	Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3YzVlZDYwY2I5YzIzNDg0MmQ0ZDYxZiIsInVzZXJuYW1lIjoiamhhZGkiLCJmaXJzdG5hbWUiOiJKYXNvbiIsImxhc3RuYW1lIjoiSGFkaSIsImVtYWlsIjoiamhhZGlAcmxzb2x1dGlvbnMuY29tIiwiZXhwQ3VycmVuY3kiOiJDQUQiLCJyZWltYkN4cnJlbmN7IjoiQ1FEIiwiaWF1IjoxNDgwMzUyMTI5fQ.QYfFYAnB3CPUbN7VJ1gt9SFvChxQbqRteIbJk1fqAbU
 */
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
