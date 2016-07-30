var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST


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

	router.get('/', function(req, res, next) {
		res.render('index', { title: 'Express' });
	});

	router.get('/login', function(req, res, next) {
		res.render('login', { title: 'Login' });
	});


	router.post('/login', function(req, res, next) {
		passport.authenticate('ldapauth', function(err, user, info) {
			console.log(user);
			if (err) { 
				console.log(err);
				return next(err); 
			}
			if (! user) { 
				return res.render('login', { msg: 'Invalid username or password.' }); 
			}
			req.login(user, { session: false }, function(err){
				if(err) { 
					console.log(err);
					return res.render('login', { msg: 'Invalid username or password.' }); 
				}
				return res.redirect('/');
			});
		})(req, res, next);
	});

	router.get('/logout', function(req, res, next) {
		res.render('index', { title: 'Express' });
	});

	return router;
};
