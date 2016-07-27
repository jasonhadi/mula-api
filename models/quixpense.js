var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
    	username: String,
    	parentExpense: mongoose.Schema.Types.ObjectId,
    	sheetNumber: Number,
    	combined: Boolean,
	img: {
		data: Buffer,
    		contentType: String
	}
});

var ReceiptSchema = new mongoose.Schema({
	sheetNumber: {type: Number, default: 0 },
    	number: { type: Number, default: 0 },
    	activity: { type: Number, default: 0 },
    	username: String,
    	where: String,
    	type: String,
    	amount: Number,
    	imgId: mongoose.Schema.Types.ObjectId,
    	parentActivity: mongoose.Schema.Types.ObjectId,
    	parentExpense: mongoose.Schema.Types.ObjectId,
	created: { type: Date, default: Date.now },
	lastUpdated: { type: Date, default: Date.now }
});

var ActivitySchema = new mongoose.Schema({
    	row: [{
		sheetNumber: {type: Number, default: 0 },
		number: { type: Number, default: 0 }
	}],
    	username: String,
	type: String,
    	clientName: String,
    	project: String,
    	description: String,
    	receipts: [ ReceiptSchema ],
    	parentExpense: mongoose.Schema.Types.ObjectId,
	created: { type: Date, default: Date.now },
	lastUpdated: { type: Date, default: Date.now }
});

var ExpenseSchema = new mongoose.Schema({
	name: String,
    	username: String,
	submitDate: Date,
    	expCurrency: String,
	reimbCurrency: String,
	oldestBillDate: Date,
	activities: [ ActivitySchema ],    
    	receiptCount: { type: Number, default: 0 },
    	sheetCount: { type: Number, default: 0 },
    	submitted: { type: Boolean, default: false },
	created: { type: Date, default: Date.now },
	lastUpdated: { type: Date, default: Date.now }
});
	    
var ExportSchema = new mongoose.Schema({
    	username: String,
    	submitDate: Date,
    	expCurrency: String,
    	reimbCurrency: String,
    	oldestBillDate: Date,
    	activites: [{
        	number: Number,
        	assignment: String,
        	project: String,
        	clientName: String,
        	description: String
    	}],
    	receipts: [{
        	number: Number,
        	activityNumber: Number,
        	where: String,
        	type: String,
        	typeString: String,
	        value: Number
    	}],
    	receiptPdf: String
});   

mongoose.model('Image', ImageSchema);
mongoose.model('Receipt', ReceiptSchema);
mongoose.model('Activity', ActivitySchema);
mongoose.model('Expense', ExpenseSchema);
mongoose.model('Export', ExportSchema);
