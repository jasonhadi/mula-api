var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
	img: {
		data: Buffer,
    		contentType: String
	}
});

var ReceiptSchema = new mongoose.Schema({
    	row: {
		sheetNumber: {type: Number, default: 0 },
		number: Number,
		activity: Number
	},
    	where: String,
    	type: Number,
    	value: Number,
    	imgId: mongoose.Schema.Types.ObjectId,
    	parentActivity: mongoose.Schema.Types.ObjectId,
    	parentExpense: mongoose.Schema.Types.ObjectId,
	created: { type: Date, default: Date.now },
	lastUpdated: { type: Date, default: Date.now }
});
var ActivitySchema = new mongoose.Schema({
    	row: [{
		sheetNumber: {type: Number, default: 0 },
		number: Number
	}],
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
	    
mongoose.model('Image', ImageSchema);
mongoose.model('Receipt', ReceiptSchema);
mongoose.model('Activity', ActivitySchema);
mongoose.model('Expense', ExpenseSchema);
