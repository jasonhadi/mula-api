var mongoose = require('mongoose');
var ActivitySchema = new mongoose.Schema({
	number: Number,
	type: String,
    	clientName: String,
    	project: String,
    	description: String,
    	created: Date,
    	lastUpdated: Date,
});
var ReceiptSchema = new mongoose.Schema({
	number: Number,
    	activity: Number,
    	where: String,
    	type: Number,
    	value: Number,
    	imgId: mongoose.Schema.Types.ObjectId,
    	created: Date,
    	lastUpdated: Date,
});
var ExpenseSchema = new mongoose.Schema({
	name: String,
    	username: String,
	submitDate: Date,
    	expCurrency: String,
	reimbCurrency: String,
	oldestBillDate: Date,
	activities: [ ActivitySchema ],    
    	receipts: [ ReceiptSchema ],
    	activityCount: { type: Number, default: 0 },
    	receiptCount: { type: Number, default: 0 },
	created: { type: Date, default: Date.now },
	lastUpdated: { type: Date, default: Date.now }
});
	    
mongoose.model('Expense', ExpenseSchema);
mongoose.model('Receipt', ReceiptSchema);
mongoose.model('Activity', ActivitySchema);
