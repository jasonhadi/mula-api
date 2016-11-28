var express = require('express'),
    session = require('express-session'),
    router = express.Router({mergeParams: true}),
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    activityController = require('../controllers/activities');

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
 * @api {get} /activities Get all Activities
 * @apiGroup Activities
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiSuccess {Object[]} activities Array list of Activities for the User.
 * @apiSuccess {ObjectId} activities._id ID of the Activity.
 * @apiSuccess {ObjectId} activities.userId The User which created this Expense.
 * @apiSuccess {String} activities.type Type of activity.
 * @apiSuccess {String} activities.clientName Name of client associated with the Activity.
 * @apiSuccess {String} activities.project Project category of Activity.
 * @apiSuccess {String} activities.description Description of Activity.
 * @apiSuccess {Date} activities.created Creation date of the Activity.
 * @apiSuccess {Date} activities.lastUpdated Last updated date of the Activity.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * [
 * 	{
 * 		"_id": "57c86fea2f4ac8860450e8a5",
 * 		"userId": "57c5ed60cb9c234842d4d61f",
 * 	 	"type": "UGC",
 * 		"project": "UGC 2016 Toronto",
 * 		"description": "Receipts for UGC 2016",
 * 		"clientName": "Alpha Client",
 * 		"lastUpdated": "2016-09-01T18:14:02.408Z",
 * 		"created": "2016-09-01T18:14:02.408Z"
 * 	}
 * ]
 */
    .get(function(req, res) {
	    activityController.getActivities(req, res, function(activities) {
		res.json(activities); 
	    });
    })
/**
 * @api {post} /activities Create new Activity
 * @apiGroup Activities
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {String} type Type of activity.
 * @apiParam {String} [clientName] Name of client associated with the Activity.
 * @apiParam {String} project Project associated with the Activity.
 * @apiParam {String} [description] Description associated with the Activity.
 * @apiParamExample {json} Content Example:
 * {
 * 	"userId": "57c5ed60cb9c234842d4d61f",
 * 	"type": "UGC",
 * 	"project": "UGC 2016 Toronto",
 * 	"description": "Receipts for UGC 2016",
 * }
 * @apiSuccess {ObjectId} _id ID of the Activity.
 * @apiSuccess {ObjectId} userId The User which created this Expense.
 * @apiSuccess {String} type Type of activity.
 * @apiSuccess {String} activities.clientName Name of client associated with the Activity.
 * @apiSuccess {String} activities.project Project category of Activity.
 * @apiSuccess {String} activities.description Description of Activity.
 * @apiSuccess {Date} activities.created Creation date of the Activity.
 * @apiSuccess {Date} activities.lastUpdated Last updated date of the Activity.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 * 	"_id": "57c86fea2f4ac8860450e8a5",
 * 	"userId": "57c5ed60cb9c234842d4d61f",
 * 	"type": "UGC",
 * 	"project": "UGC 2016 Toronto",
 * 	"description": "Receipts for UGC 2016",
 * 	"lastUpdated": "2016-09-01T18:14:02.408Z",
 * 	"created": "2016-09-01T18:14:02.408Z"
 * }
 */
    .post(function(req, res) {
	    activityController.newActivity(req, res, function(activity) {
		res.json(activity);	    
	    });
    });

router.param('activityid', function(req, res, next, activityid) {
	activityController.verifyActivityId(req, res, next, activityid);
});

router.route('/:activityid')
/**
 * @api {get} /activities/:activityid Get Activity by ID
 * @apiGroup Activities
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {ObjectId} activityid Activity ID of the Activity.
 * @apiSuccess {ObjectId} _id ID of the Activity.
 * @apiSuccess {ObjectId} userId The User which created this Expense.
 * @apiSuccess {String} type Type of activity.
 * @apiSuccess {String} clientName Name of client associated with the Activity.
 * @apiSuccess {String} project Project category of Activity.
 * @apiSuccess {String} description Description of Activity.
 * @apiSuccess {Date} created Creation date of the Activity.
 * @apiSuccess {Date} lastUpdated Last updated date of the Activity.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 * 	"_id": "57c86fea2f4ac8860450e8a5",
 * 	"userId": "57c5ed60cb9c234842d4d61f",
 * 	"type": "UGC",
 * 	"project": "UGC 2016 Toronto",
 * 	"description": "Receipts for UGC 2016",
 * 	"lastUpdated": "2016-09-01T18:14:02.408Z",
 * 	"created": "2016-09-01T18:14:02.408Z"
 * }
 */
  .get(function(req, res) {
	  activityController.getActivity(req, res, function(activity) {
		res.json(activity);
	  });
  })
/**
 * @api {put} /activities/:activityid Update Activity by ID
 * @apiGroup Activities
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {ObjectId} activityid Activity ID of the Activity.
 * @apiParam {String} type Type of activity.
 * @apiParam {String} [clientName] Name of client associated with the Activity.
 * @apiParam {String} project Project associated with the Activity.
 * @apiParam {String} [description] Description associated with the Activity.
 * @apiParamExample {json} Content Example:
 * {
 * 	"type": "UGC",
 * 	"project": "UGC 2016 Toronto",
 * 	"description": "Receipts for UGC 2016",
 * }
 * @apiSuccess {ObjectId} _id ID of the Activity.
 * @apiSuccess {ObjectId} userId The User which created this Activity.
 * @apiSuccess {String} type Type of activity.
 * @apiSuccess {String} clientName Name of client associated with the Activity.
 * @apiSuccess {String} project Project category of Activity.
 * @apiSuccess {String} description Description of Activity.
 * @apiSuccess {Date} created Creation date of the Activity.
 * @apiSuccess {Date} lastUpdated Last updated date of the Activity.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 * 	"_id": "57c86fea2f4ac8860450e8a5",
 * 	"userId": "57c5ed60cb9c234842d4d61f",
 * 	"type": "UGC",
 * 	"project": "UGC 2016 Toronto",
 * 	"description": "Receipts for UGC 2016",
 * 	"lastUpdated": "2016-09-01T18:14:02.408Z",
 * 	"created": "2016-09-01T18:14:02.408Z"
 * }
 */
  .put(function(req, res) {
	  activityController.updateActivity(req, res, function(activity) {
		res.json(activity);
	  });
  })
/**
 * @api {delete} /activities/:activityid Delete Activity by ID
 * @apiGroup Activities
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {ObjectId} activityid Activity ID of the Activity.
 * @apiSuccess {String="success","failed"} status Status of the DELETE action.
 * @apiSuccess {Object} activity Activity object.
 * @apiSuccess {ObjectId} activity._id ID of the Activity.
 * @apiSuccess {ObjectId} activity.userId The User which created this Activity.
 * @apiSuccess {String} activity.type Type of activity.
 * @apiSuccess {String} activity.clientName Name of client associated with the Activity.
 * @apiSuccess {String} activity.project Project category of Activity.
 * @apiSuccess {String} activity.description Description of Activity.
 * @apiSuccess {Date} activity.created Creation date of the Activity.
 * @apiSuccess {Date} activity.lastUpdated Last updated date of the Activity.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 * 	"status": "success",
 * 	"activity" : {
 * 		"_id": "57c86fea2f4ac8860450e8a5",
 * 		"userId": "57c5ed60cb9c234842d4d61f",
 * 		"type": "UGC",
 * 		"project": "UGC 2016 Toronto",
 * 		"description": "Receipts for UGC 2016",
 * 		"lastUpdated": "2016-09-01T18:14:02.408Z",
 * 		"created": "2016-09-01T18:14:02.408Z"
 * 	}
 * }
 */
  .delete(function(req, res) {
	  activityController.deleteActivity(req, res, function(activity) {
		res.json(activity);
	  });
  });

module.exports = router;
