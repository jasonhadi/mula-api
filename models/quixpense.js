var mongoose = require('mongoose');

mongoose.set('debug', true);

var ImageSchema = new mongoose.Schema({
    	username: mongoose.Schema.Types.ObjectId,
    	parentExpense: mongoose.Schema.Types.ObjectId,
    	parentReceipt: mongoose.Schema.Types.ObjectId,
	img: {
		data: Buffer,
    		contentType: String
	}
});

var ReceiptSchema = new mongoose.Schema({
	sheetNumber: {type: Number, default: 0 },
    	userId: mongoose.Schema.Types.ObjectId,
    	imgId: mongoose.Schema.Types.ObjectId,
    	parentActivity: mongoose.Schema.Types.ObjectId,
    	parentExpense: mongoose.Schema.Types.ObjectId,
    	receiptNumber: { type: Number, default: 0 },
    	activityNumber: { type: Number, default: 0 },
    	where: String,
    	type: String,
    	amount: Number,
    	description: String,
	created: { type: Date, default: Date.now },
	lastUpdated: { type: Date, default: Date.now },
	submitted: { type: Date },
    	processed: Boolean
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
	    
var UserSchema = new mongoose.Schema({
    	username: String,
    	displayName: String,
    	email: String,
    	expCurrency: String,
    	reimbCurrency: String,
    	isCorporateCard: Boolean,
    	cardType: String,
    	bankType: String
});   

module.exports = {
	Image: mongoose.model('Image', ImageSchema),
	Receipt: mongoose.model('Receipt', ReceiptSchema),
	Activity: mongoose.model('Activity', ActivitySchema),
	ExpenseModel: mongoose.model('Expense', ExpenseSchema),
	User: mongoose.model('User', UserSchema)
};
