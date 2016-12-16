var mongoose = require('mongoose');

mongoose.set('debug', false);

var ReceiptSchema = new mongoose.Schema({
    	userId: mongoose.Schema.Types.ObjectId,
	img: {
		data: Buffer,
    		contentType: String
	},
    	parentProject: mongoose.Schema.Types.ObjectId,
    	parentExpense: mongoose.Schema.Types.ObjectId,
    	receiptNumber: Number,
    	projectNumber: Number,
	sheetNumber: Number,
    	where: String,
    	whereDisplayName: String,
    	type: String,
    	amount: Number,
	date: { type: Date, default: Date.now },
    	description: String,
	created: { type: Date, default: Date.now },
	lastUpdated: { type: Date, default: Date.now },
	submitted: { type: Boolean, default: false }
});

var ProjectSchema = new mongoose.Schema({
    	row: [{
		sheetNumber: {type: Number, default: 0 },
		number: { type: Number, default: 0 }
	}],
    	userId: mongoose.Schema.Types.ObjectId,
	assignment: String,
    	clientName: String,
    	name: String,
    	description: String,
    	receiptCount: { type: Number, default: 0 },
    	parentExpense: mongoose.Schema.Types.ObjectId,
	created: { type: Date, default: Date.now },
	submitted: { type: Boolean, default: false },
	lastUpdated: { type: Date, default: Date.now }
});

var ExpenseSchema = new mongoose.Schema({
    	userId: mongoose.Schema.Types.ObjectId,
    	fullname: String,
	submitDate: { type: Date, default: Date.now },
    	expCurrency: String,
	reimbCurrency: String,
	oldestBillDate: { type: Date, default: Date.now },
    	receiptCount: { type: Number, default: 0 },
    	sheetCount: { type: Number, default: 0 },
	number: Number,
	sheet: {
		data: Buffer,
    		contentType: String
	},
    	projects: [ ProjectSchema ],
    	receipts: [ ReceiptSchema],
	created: { type: Date, default: Date.now },
	lastUpdated: { type: Date, default: Date.now }
});
	    
var UserSchema = new mongoose.Schema({
    	username: String,
    	expCurrency: { type: String, default: 'CAD' },
    	reimbCurrency: { type: String, default: 'CAD' },
	expenseCount: { type: Number, default: 1},
    	hasCorporateCard: { type: Boolean, default: false },
    	cardType: String,
    	bankType: String
});   

var FeedbackSchema = new mongoose.Schema({
	fullname: String,
	submitted: { type: Date, default: Date.now },
    	feedback: String
});

var ExportSchema = new mongoose.Schema({
	expenseId: mongoose.Schema.Types.ObjectId,
    	userId: mongoose.Schema.Types.ObjectId,
	email: String,
	submitted: { type: Date, default: Date.now },
    	action: { type: String, enum: ['generate', 'mail'] }
}, {capped: 1024});

module.exports = {
	Receipt: mongoose.model('Receipt', ReceiptSchema),
	Project: mongoose.model('Project', ProjectSchema),
	Expense: mongoose.model('Expense', ExpenseSchema),
	User: mongoose.model('User', UserSchema),
	Feedback: mongoose.model('Feedback', FeedbackSchema),
	Export: mongoose.model('Export', ExportSchema)
};
