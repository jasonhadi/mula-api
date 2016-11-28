var express = require('express'),
    router = express.Router(),
    userController = require('../controllers/users');

router.route('/')
/**
 * @api {get} /user Get User 
 * @apiGroup User
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiSuccess {ObjectId} ID of the User.
 * @apiSuccess {String} username Username of the User.
 * @apiSuccess {String} firstname First name of the User.
 * @apiSuccess {String} lastname Last name of the User.
 * @apiSuccess {String} email Email of the User.
 * @apiSuccess {String} expCurrency Expense currency of the User.
 * @apiSuccess {String} reimbCurrency Reimbursement currency of the User.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 * 	"id": "57c5ed60cb9c234842d4d61f",
 * 	"username": "jhadi",
 * 	"firstname": "Jason",
 * 	"lastname": "Hadi",
 * 	"email": "jhadi@rlsolutions.com",
 * 	"expCurrency": "CAD",
 * 	"reimbCurrency": "CAD",
 * 	"iat": 1480347240
 * }
 */
	.get(function(req, res) {
		res.json(req.user);
	})
/**
 * @api {put} /user Update User 
 * @apiGroup User
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {String} expCurrency Expense currency of the User.
 * @apiParam {String} reimbCurrency Reimbursement currency of the User.
 * @apiParamExample {json} Content Example:
 * {
 * 	"expCurrency": "CAD"
 * }
 * @apiParam {ObjectId} ID of the User.
 * @apiSuccess {String} username Username of the User.
 * @apiSuccess {String} firstname First name of the User.
 * @apiSuccess {String} lastname Last name of the User.
 * @apiSuccess {String} email Email of the User.
 * @apiSuccess {String} expCurrency Expense currency of the User.
 * @apiSuccess {String} reimbCurrency Reimbursement currency of the User.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 * 	"id": "57c5ed60cb9c234842d4d61f",
 * 	"username": "jhadi",
 * 	"firstname": "Jason",
 * 	"lastname": "Hadi",
 * 	"email": "jhadi@rlsolutions.com",
 * 	"expCurrency": "CAD",
 * 	"reimbCurrency": "CAD",
 * 	"iat": 1480347240
 * }
 */
	.put(function(req, res) {
		userController.updateUser(req, res, function(user) {
			res.json(user);
		});
	});

module.exports = router;
