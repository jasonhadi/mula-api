var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var passport = require('passport');
var LdapStrategy = require('passport-ldapauth');

var config = require('./config');
var db = require('./models/db');
var Quixpense = require ('./models/quixpense.js');

var app = express();

passport.use(new LdapStrategy(config.ldap));

passport.serializeUser(function(user, next) {
	console.log( JSON.stringify(user) );
	next(null, user.sAMAccountName);
});

passport.deserializeUser(function(username, next) {
	Quixpense.User.getUser(username, function(err, user) {
		console.log( JSON.stringify(user) );
		next(null, user);
	});
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'islayscotch' }));
app.use(passport.initialize());

var routes = require('./routes/index')(passport);
var expenses = require('./routes/expenses');
var activities = require('./routes/activities');
var receipts = require('./routes/receipts');

app.use('/', routes);
app.use('/expenses', expenses);
app.use('/activities', activities);
app.use('/receipts', receipts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
