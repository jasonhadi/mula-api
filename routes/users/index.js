var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    userController = require('../../controllers/users');

var receipts = require('./receipts');
var activities = require('./activities');

module.exports = function(passport) {
	router.use(bodyParser.urlencoded({ extended: true }));
	router.use(methodOverride(function(req, res){
		if (req.body && typeof req.body === 'object' && '_method' in req.body) {
			// look in urlencoded POST bodies and delete it
			var method = req.body._method;
			delete req.body._method;
			return method;
		}
	}));

	router.route('/')
		.get(function(req, res) {
			userController.getAllUsers(req, res, function(user) {
				res.json(user);
			});
		})
		.post(function(req, res) {
			userController.newUser(req, res, function(user) {
				res.json(user);
			});
		});


	router.param('userid', function(req, res, next, userid) {
		userController.verifyUser(req, res, next, userid);
	});

	router.route('/:userid')
		.get(function(req, res) {
			userController.getUser(req, res, function(user) {
				res.json(user);
			});
		})
		.put(function(req, res) {
			userController.updateUser(req, res, function(user) {
				res.json(user);
			});
		});

	router.use('/:userid/receipts', receipts);
	router.use('/:userid/activities', activities);

	return router;
};

//	router.get('/login', function(req, res, next) {
//		res.render('login', { title: 'Login' });
//	});
//
//
//	router.post('/login', function(req, res, next) {
//		passport.authenticate('ldapauth', function(err, user, info) {
//			console.log(user);
//			if (err) { 
//				console.log(err);
//				return next(err); 
//			}
//			if (! user) { 
//				return res.render('login', { msg: 'Invalid username or password.' }); 
//			}
//			req.login(user, { session: false }, function(err){
//				if(err) { 
//					console.log(err);
//					return res.render('login', { msg: 'Invalid username or password.' }); 
//				}
//				return res.redirect('/');
//			});
//		})(req, res, next);
//	});
//
//	router.get('/logout', function(req, res, next) {
//		res.render('index', { title: 'Express' });
//	});
