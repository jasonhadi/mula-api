var express = require('express'),
    session = require('express-session'),
    router = express.Router({mergeParams: true}),
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    expenseController = require('../controllers/expenses');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
      }
}));

router.route('/')
/**
 * @api {get} /expenses Get all Expenses 
 * @apiGroup Expenses
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiSuccess {Object[]} expenses Array list of Expenses for the user.
 * @apiSuccess {ObjectId} expenses._id ID of the Expense.
 * @apiSuccess {Activity[]} expenses.activities Array list of activities in the Expense. See Activities section for Activity object description.
 * @apiSuccess {Date} expenses.created Creation date of the Expense.
 * @apiSuccess {Date} expenses.lastUpdated Last updated date of the Expense.
 * @apiSuccess {Date} expenses.oldestBillDate Date of the oldest receipt in the Expense.
 * @apiSuccess {Receipt[]} expenses.receipts Array list of receipts in the Expense. See Receipts section for Receipt object description.
 * @apiSuccess {Date} expenses.submitDate Date when the Expense was submitted.
 * @apiSuccess {Boolean} expenses.submitted Whether the Expense has been exported.
 * @apiSuccess {ObjectId} expenses.userId The user which created this Expense.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *       "__v": 0,
 *       "_id": "57c9c83e2ae2efd65a1e16b3",
 *       "activities": [
 *           {
 *     		...                
 *           }
 *       ],
 *       "created": "2016-09-02T18:43:10.738Z",
 *       "lastUpdated": "2016-09-02T18:43:10.738Z",
 *       "oldestBillDate": "2016-09-02T18:43:10.736Z",
 *       "receipts": [
 *           {
 *     		...                
 *           }
 *       ],
 *       "submitDate": "2016-09-02T18:43:10.736Z",
 *       "submitted": false,
 *       "userId": "57c5ed60cb9c234842d4d61f"
 *   }
 * ]
 */
    .get(function(req, res) {
	    expenseController.getExpenses(req, res, function(expenses) {
		res.json(expenses);	    
	    });
    })
/**
 * @api {post} /expenses Create new Expense 
 * @apiGroup Expenses
 * @apiDescription This action will generate the expense spreadsheet, create the combined receipt PDF, and send an email to the user with the attachments.
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {ObjectId[]} activities Array list of activity IDs included in submitted Expense.
 * @apiParamExample {json} Content Example:
 * {
 * 	"activities": [
 * 		"57c86fea2f4ac8860450e8a5",
 * 		"57c86ff12f4ac8860450e8a6"
 * 	]
 * }
 * @apiSuccess {Object[]} expenses Array list of Expenses for the user.
 * @apiSuccess {ObjectId} expenses._id ID of the Expense.
 * @apiSuccess {Activity[]} expenses.activities Array list of activities in the Expense. See Activities section for Activity object description.
 * @apiSuccess {Date} expenses.created Creation date of the Expense.
 * @apiSuccess {Date} expenses.lastUpdated Last updated date of the Expense.
 * @apiSuccess {Date} expenses.oldestBillDate Date of the oldest receipt in the Expense.
 * @apiSuccess {Receipt[]} expenses.receipts Array list of receipts in the Expense. See Receipts section for Receipt object description.
 * @apiSuccess {Date} expenses.submitDate Date when the Expense was submitted.
 * @apiSuccess {Boolean} expenses.submitted Whether the Expense has been exported.
 * @apiSuccess {ObjectId} expenses.userId The user which created this Expense.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * [
 *   {
 *       "__v": 0,
 *       "_id": "57c9c83e2ae2efd65a1e16b3",
 *       "activities": [
 *           {
 *     		...                
 *           }
 *       ],
 *       "created": "2016-09-02T18:43:10.738Z",
 *       "lastUpdated": "2016-09-02T18:43:10.738Z",
 *       "oldestBillDate": "2016-09-02T18:43:10.736Z",
 *       "receipts": [
 *           {
 *     		...                
 *           }
 *       ],
 *       "submitDate": "2016-09-02T18:43:10.736Z",
 *       "submitted": false,
 *       "userId": "57c5ed60cb9c234842d4d61f"
 *   }
 * ]
 */
    .post(function(req, res) {
	    expenseController.numberExpenses(req, res, function(expenses) {
		res.json(expenses);	    
	    });
    });

router.param('expenseid', function(req, res, next, expenseid) {
	expenseController.verifyExpenseId(req, res, next, expenseid);
});

router.route('/:expenseid')
/**
 * @api {get} /expenses/:expenseid Get Expense by ID
 * @apiGroup Expenses
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {ObjectId} expenseid Expense ID of the requested Expense.
 * @apiSuccess {ObjectId} _id ID of the Expense.
 * @apiSuccess {Activity[]} activities Array list of activities in the Expense. See Activities section for Activity object description.
 * @apiSuccess {Date} created Creation date of the Expense.
 * @apiSuccess {Date} lastUpdated Last updated date of the Expense.
 * @apiSuccess {Date} oldestBillDate Date of the oldest receipt in the Expense.
 * @apiSuccess {Receipt[]} receipts Array list of receipts in the Expense. See Receipts section for Receipt object description.
 * @apiSuccess {Date} submitDate Date when the Expense was submitted.
 * @apiSuccess {Boolean} submitted Whether the Expense has been exported.
 * @apiSuccess {ObjectId} userId The user which created this Expense.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 *     "__v": 0,
 *     "_id": "57c9c83e2ae2efd65a1e16b3",
 *     "activities": [
 *         {
 *   		...                
 *         }
 *     ],
 *     "created": "2016-09-02T18:43:10.738Z",
 *     "lastUpdated": "2016-09-02T18:43:10.738Z",
 *     "oldestBillDate": "2016-09-02T18:43:10.736Z",
 *     "receipts": [
 *         {
 *   		...                
 *         }
 *     ],
 *     "submitDate": "2016-09-02T18:43:10.736Z",
 *     "submitted": false,
 *     "userId": "57c5ed60cb9c234842d4d61f"
 * }
 */
    .get(function(req, res) {
	    expenseController.getExpense(req, res, function(expense) {
		res.json(expense);	    
	    });
    })
    .delete(function(req, res) {
	    expenseController.deleteExpense(req, res, function(expense) {
		res.json(expense);	    
	    });
    });


router.route('/:expenseid/pdf')
/**
 * @api {get} /expenses/:expenseid/pdf Get Expense PDF by ID
 * @apiGroup Expenses
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {ObjectId} expenseid Expense ID of the requested Expense.
 */
  .get(function(req, res) {
	  expenseController.getExpenseSheet(req, res, function(expense) {
		  var img64 = expense.sheet.data;
		  var img = new Buffer(img64, 'base64');

		  res.writeHead(200, {
			  'Content-Type': expense.sheet.contentType,
			  'Content-Length': img.length
		  });
		  res.end(img);
	  });
  });

module.exports = router;
