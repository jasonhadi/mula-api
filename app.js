var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var passport = require('passport');
var LdapStrategy = require('passport-ldapauth');
var ejwt = require('express-jwt');

var config = require('./config');
var db = require('./models/db');
var Quixpense = require ('./models/quixpense.js');
var sql = require('mssql');
var sqlConn = new sql.Connection(config.mssql);
sql.globalConnection = sqlConn;
sql.globalConnection.connect();

var app = express();

passport.use(new LdapStrategy(config.ldap));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(ejwt({secret: config.jwtsecret}).unless({path: ['/auth']}));

var auth = require('./routes/auth')(passport);
var users = require('./routes/users');
var gp = require('./routes/gp');
var expenses = require('./routes/expenses');
var projects = require('./routes/projects');
var receipts = require('./routes/receipts');

app.use('/auth', auth);
app.use('/user', users);
app.use('/gp', gp);
app.use('/expenses', expenses);
app.use('/projects', projects);
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
