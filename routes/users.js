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
/**
 * @api {post} /feedback Submit Feedback
 * @apiGroup User
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {String} feedback Feedback to be submitted.
 * @apiParamExample {json} Content Example:
 * {
 * 	"feedback": "This app is ok."
 * }
 * @apiSuccess {String} fullname Full name of User who submitted Feedback.
 * @apiSuccess {String} feedback The full text of the submitted Feedback.
 * @apiSuccess {Date} submitted The date the feedback was submitted.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 *     "fullname" : "Jason Hadi",
 *     "feedback" : "This is feedback special symbols &@#$%^&*.",
 *     "submitted" : ISODate("2016-11-28T22:37:54.151Z"),
 * }
 */
router.route('/feedback')
	.post(function(req, res) {
		userController.submitFeedback(req, res, function(feedback) {
			res.json(feedback);
		});
	});

module.exports = router;
