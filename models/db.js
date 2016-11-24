var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.mongodb[process.env.NODE_ENV]);
