var mongoose = require('mongoose');

var GPProjectSchema = new mongoose.Schema({
	assignment: String,
    	type: { type: String, enum: ['misc', 'conference', 'salestrip', 'offdptevt'] },
    	costCategories: [ String ],
    	displayname: String,
    	gpname: String
});

var GPLocationSchema = new mongoose.Schema({
	location: String,
	code: String		
});


module.exports = {
	Project: mongoose.model('GPProject', GPProjectSchema),
	Location: mongoose.model('GPLocation', GPLocationSchema)
};
