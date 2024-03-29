var express = require('express'),
    session = require('express-session'),
    router = express.Router({mergeParams: true}),
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    projectController = require('../controllers/projects');

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
 * @api {get} /projects Get all Projects
 * @apiGroup Projects
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiSuccess {Object[]} projects Array list of Projects for the User.
 * @apiSuccess {ObjectId} projects._id ID of the Project.
 * @apiSuccess {ObjectId} projects.userId The User which created this Expense.
 * @apiSuccess {String} projects.assignment Assignment of project.
 * @apiSuccess {String} projects.clientName Name of client associated with the Project.
 * @apiSuccess {String} projects.name Name of Project.
 * @apiSuccess {String} projects.description Description of Project.
 * @apiSuccess {Date} projects.created Creation date of the Project.
 * @apiSuccess {Date} projects.lastUpdated Last updated date of the Project.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * [
 * 	{
 * 		"_id": "57c86fea2f4ac8860450e8a5",
 * 		"userId": "57c5ed60cb9c234842d4d61f",
 * 	 	"assignment": "UGC",
 * 		"name": "UGC 2016 Toronto",
 * 		"description": "Receipts for UGC 2016",
 * 		"clientName": "Alpha Client",
 * 		"lastUpdated": "2016-09-01T18:14:02.408Z",
 * 		"created": "2016-09-01T18:14:02.408Z"
 * 	}
 * ]
 */
    .get(function(req, res) {
	    projectController.getProjects(req, res, function(projects) {
		res.json(projects); 
	    });
    })
/**
 * @api {post} /projects Create new Project
 * @apiGroup Projects
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {String} assignment Assignment of project.
 * @apiParam {String} [clientName] Name of client associated with the Project.
 * @apiParam {String} name Name associated with the Project.
 * @apiParam {String} [description] Description associated with the Project.
 * @apiParamExample {json} Content Example:
 * {
 * 	"assignment": "UGC",
 * 	"name": "UGC 2016 Toronto",
 * 	"description": "Receipts for UGC 2016",
 * }
 * @apiSuccess {ObjectId} _id ID of the Project.
 * @apiSuccess {ObjectId} userId The User which created this Expense.
 * @apiSuccess {String} assignment Assignment of project.
 * @apiSuccess {String} projects.clientName Name of client associated with the Project.
 * @apiSuccess {String} projects.name Name of Project.
 * @apiSuccess {String} projects.description Description of Project.
 * @apiSuccess {Date} projects.created Creation date of the Project.
 * @apiSuccess {Date} projects.lastUpdated Last updated date of the Project.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 * 	"_id": "57c86fea2f4ac8860450e8a5",
 * 	"userId": "57c5ed60cb9c234842d4d61f",
 * 	"assignment": "UGC",
 * 	"name": "UGC 2016 Toronto",
 * 	"description": "Receipts for UGC 2016",
 * 	"lastUpdated": "2016-09-01T18:14:02.408Z",
 * 	"created": "2016-09-01T18:14:02.408Z"
 * }
 */
    .post(function(req, res) {
	    projectController.newProject(req, res, function(project) {
		res.json(project);	    
	    });
    });

router.route('/batch')
/**
 * @api {post} /projects/batch Batch create Projects
 * @apiGroup Projects
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {Object[]} projects Array of new Projects.
 * @apiParam {String} projects.assignment Assignment of project.
 * @apiParam {String} [projects.clientName] Name of client associated with the Project.
 * @apiParam {String} projects.name Name associated with the Project.
 * @apiParam {String} [projects.description] Description associated with the Project.
 * @apiParamExample {json} Content Example:
 * {
 * 	"projects": [
 * 		{
 * 			"assignment": "UGC",
 * 			"name": "UGC 2016 Toronto",
 * 			"description": "Receipts for UGC 2016",
 * 		}
 * 	]
 * }
 * @apiSuccess {Number} count Number of Projects created.
 * @apiSuccess {String="success","failed"} status Status of the batch Project CREATE action.
 * @apiSuccess {Object[]} projects Array of new Projects.
 * @apiSuccess {ObjectId} projects._id ID of the Project.
 * @apiSuccess {ObjectId} projects.userId The User which created this Expense.
 * @apiSuccess {String} projects.assignment Assignment of project.
 * @apiSuccess {String} projects.clientName Name of client associated with the Project.
 * @apiSuccess {String} projects.name Name of Project.
 * @apiSuccess {String} projects.description Description of Project.
 * @apiSuccess {Date} projects.created Creation date of the Project.
 * @apiSuccess {Date} projects.lastUpdated Last updated date of the Project.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 * 	"count": 1,
 * 	"status": "success",
 * 	"projects": [ {
 * 		"_id": "57c86fea2f4ac8860450e8a5",
 * 		"userId": "57c5ed60cb9c234842d4d61f",
 * 		"assignment": "UGC",
 * 		"name": "UGC 2016 Toronto",
 * 		"description": "Receipts for UGC 2016",
 * 		"lastUpdated": "2016-09-01T18:14:02.408Z",
 * 		"created": "2016-09-01T18:14:02.408Z"
 * 	} ]
 * }
 */
  .post(function(req, res) {
	  projectController.batchCreate(req, res, function(project) {
		res.json(project);
	  });
  })
/**
 * @api {put} /projects/batch Batch update Projects
 * @apiGroup Projects
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {Object[]} projects Array of Projects.
 * @apiParam {ObjectId} projects._id ID of the Project.
 * @apiParam {String} [projects.assignment] Assignment of project.
 * @apiParam {String} [projects.clientName] Name of client associated with the Project.
 * @apiParam {String} [projects.name] Name associated with the Project.
 * @apiParam {String} [projects.description] Description associated with the Project.
 * @apiParamExample {json} Content Example:
 * {
 * 	"projects": [
 * 		{
 * 			"_id": "57c86fea2f4ac8860450e8a5",
 * 			"assignment": "UGC",
 * 			"name": "UGC 2016 Toronto",
 * 			"description": "Receipts for UGC 2016",
 * 		}
 * 	]
 * }
 * @apiSuccess {Number} count Number of Projects updated.
 * @apiSuccess {String="success","failed"} status Status of the batch Project UPDATE action.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 * 	"count": 1,
 * 	"status": "success",
  * }
 */
  .put(function(req, res) {
	  projectController.batchUpdate(req, res, function(project) {
		res.json(project);
	  });
  })
/**
 * @api {delete} /projects/batch Batch delete Projects
 * @apiGroup Projects
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {ObjectId[]} projects Array of Project IDs.
 * @apiParamExample {json} Content Example:
 * {
 * 	"projects": [
 * 		"57c86fea2f4ac8860450e8a5"
 * 	]
 * }
 * @apiSuccess {Number} count Number of Projects deleted.
 * @apiSuccess {String="success","failed"} status Status of the batch Project DELETE action.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 * 	"count": 1,
 * 	"status": "success",
  * }
 */
  .delete(function(req, res) {
	  projectController.batchDelete(req, res, function(project) {
		res.json(project);
	  });
  });

router.param('projectid', function(req, res, next, projectid) {
	projectController.verifyProjectId(req, res, next, projectid);
});

router.route('/:projectid')
/**
 * @api {get} /projects/:projectid Get Project by ID
 * @apiGroup Projects
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {ObjectId} projectid Project ID of the Project.
 * @apiSuccess {ObjectId} _id ID of the Project.
 * @apiSuccess {ObjectId} userId The User which created this Expense.
 * @apiSuccess {String} assignment Assignment of project.
 * @apiSuccess {String} clientName Name of client associated with the Project.
 * @apiSuccess {String} name Name of Project.
 * @apiSuccess {String} description Description of Project.
 * @apiSuccess {Date} created Creation date of the Project.
 * @apiSuccess {Date} lastUpdated Last updated date of the Project.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 * 	"_id": "57c86fea2f4ac8860450e8a5",
 * 	"userId": "57c5ed60cb9c234842d4d61f",
 * 	"assignment": "UGC",
 * 	"name": "UGC 2016 Toronto",
 * 	"description": "Receipts for UGC 2016",
 * 	"lastUpdated": "2016-09-01T18:14:02.408Z",
 * 	"created": "2016-09-01T18:14:02.408Z"
 * }
 */
  .get(function(req, res) {
	  projectController.getProject(req, res, function(project) {
		res.json(project);
	  });
  })
/**
 * @api {put} /projects/:projectid Update Project by ID
 * @apiGroup Projects
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {ObjectId} projectid Project ID of the Project.
 * @apiParam {String} assignment Assignment of project.
 * @apiParam {String} [clientName] Name of client associated with the Project.
 * @apiParam {String} name Name associated with the Project.
 * @apiParam {String} [description] Description associated with the Project.
 * @apiParamExample {json} Content Example:
 * {
 * 	"assignment": "UGC",
 * 	"name": "UGC 2016 Toronto",
 * 	"description": "Receipts for UGC 2016",
 * }
 * @apiSuccess {ObjectId} _id ID of the Project.
 * @apiSuccess {ObjectId} userId The User which created this Project.
 * @apiSuccess {String} assignment Assignment of project.
 * @apiSuccess {String} clientName Name of client associated with the Project.
 * @apiSuccess {String} name Name of Project.
 * @apiSuccess {String} description Description of Project.
 * @apiSuccess {Date} created Creation date of the Project.
 * @apiSuccess {Date} lastUpdated Last updated date of the Project.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 * 	"_id": "57c86fea2f4ac8860450e8a5",
 * 	"userId": "57c5ed60cb9c234842d4d61f",
 * 	"assignment": "UGC",
 * 	"name": "UGC 2016 Toronto",
 * 	"description": "Receipts for UGC 2016",
 * 	"lastUpdated": "2016-09-01T18:14:02.408Z",
 * 	"created": "2016-09-01T18:14:02.408Z"
 * }
 */
  .put(function(req, res) {
	  projectController.updateProject(req, res, function(project) {
		res.json(project);
	  });
  })
/**
 * @api {delete} /projects/:projectid Delete Project by ID
 * @apiGroup Projects
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {ObjectId} projectid Project ID of the Project.
 * @apiSuccess {String="success","failed"} status Status of the DELETE action.
 * @apiSuccess {Object} project Project object.
 * @apiSuccess {ObjectId} project._id ID of the Project.
 * @apiSuccess {ObjectId} project.userId The User which created this Project.
 * @apiSuccess {String} project.assignment Assignment of project.
 * @apiSuccess {String} project.clientName Name of client associated with the Project.
 * @apiSuccess {String} project.name Project category of Project.
 * @apiSuccess {String} project.description Description of Project.
 * @apiSuccess {Date} project.created Creation date of the Project.
 * @apiSuccess {Date} project.lastUpdated Last updated date of the Project.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * {
 * 	"status": "success",
 * 	"project" : {
 * 		"_id": "57c86fea2f4ac8860450e8a5",
 * 		"userId": "57c5ed60cb9c234842d4d61f",
 * 		"assignment": "UGC",
 * 		"name": "UGC 2016 Toronto",
 * 		"description": "Receipts for UGC 2016",
 * 		"lastUpdated": "2016-09-01T18:14:02.408Z",
 * 		"created": "2016-09-01T18:14:02.408Z"
 * 	}
 * }
 */
  .delete(function(req, res) {
	  projectController.deleteProject(req, res, function(project) {
		res.json(project);
	  });
  });
/**
 * @api {get} /projects/:projectid/receipts Get Receipts by Project ID
 * @apiGroup Projects
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiParam {ObjectId} projectid Project ID of the Project.
 * @apiSuccess {Object[]} receipts Array list of Receipts.
 * @apiSuccess {ObjectId} receipts._id ID of the Receipt.
 * @apiSuccess {ObjectId} receipts.userId The User which created this Receipt.
 * @apiSuccess {ObjectId} receipts.parentProject The Project ID which this Receipt is categorized under.
 * @apiSuccess {String} receipts.type Type of Receipt.
 * @apiSuccess {String="O","U","Can HST", "Can GST"} receipts.where Location code of Receipt.
 * @apiSuccess {Number} receipts.amount Value of Receipt.
 * @apiSuccess {String} [receipts.description] Description of Receipt.
 * @apiSuccess {Date} receipts.created Creation date of the Receipt.
 * @apiSuccess {Date} receipts.created Creation date of the Receipt.
 * @apiSuccess {Date} receipts.date Date marked on Receipt.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * [
 *	{
 *		"_id": "57c8704c2f4ac8860450e8a8",
 *		"userId": "57c5ed60cb9c234842d4d61f",
 *		"where": "O",
 *		"type": "Taxi",
 *		"amount": 20.52,
 *		"parentProject": "57c86ff12f4ac8860450e8a6",
 *		"lastUpdated": "2016-09-01T18:15:41.130Z",
 *		"created": "2016-09-01T18:15:41.130Z",
 *		"date": "2016-09-01T20:50:23.676Z",
 *	}
 * ]
 */
router.route('/:projectid/receipts')
  .get(function(req, res) {
	  projectController.getReceipts(req, res, function(receipts) {
		res.json(receipts);
	  });
  });


module.exports = router;
