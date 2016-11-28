var express = require('express'),
    router = express.Router(),
    gp = require('../controllers/gp');


module.exports = function(passport) {
/**
 * @api {get} /gp/expenses Get all Projects
 * @apiGroup GP
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiSuccess {String[]} projects String Array of Projects in GP.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * [
 *   "Sales Travel: International",
 *   "Product Research",
 *   ...
 *   "UGC 2016"
 * ]  
 */
	router.get('/projects', function(req, res) {
		gp.getProjects(req, res, function(projects) {
			res.json(projects);
		});	
	});
/**
 * @api {get} /gp/assignments Get all Assignments
 * @apiGroup GP
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiSuccess {String[]} assignments String Array list of Assignments in GP.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * [
 *   "Alliances",
 *   "Donations",
 *   ...
 *   "Office Overhead"
 * ]  
 */
	router.get('/assignments', function(req, res) {
		gp.getAssignments(req, res, function(assignments) {
			res.json(assignments);
		});	
	});
/**
 * @api {get} /gp/costcategories Get all Cost Categories
 * @apiGroup GP
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiSuccess {String[]} costcategories String Array list of Cost Categories in GP.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * [
 *   "Accounting",
 *   "Advertising",
 *   ...
 *   "Supplies"
 * ]  
 */
	router.get('/costcategories', function(req, res) {
		gp.getCostCategories(req, res, function(costCategories) {
			res.json(costCategories);
		});	
	});
/**
 * @api {get} /gp/mapping Get full GP mapping
 * @apiGroup GP
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiSuccess {Object[]} gp Array list of projects in GP.
 * @apiSuccess {Object} project Project object from GP.
 * @apiSuccess {String} project.projectname Project name of Project from GP.
 * @apiSuccess {String} project.Assignment Assignment of Project from GP.
 * @apiSuccess {String[]} project.costCategories String Array of related Cost Categories of Project from GP.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * [
 *    {
 *        "Assignment": "Client Billable",
 *        "Project Name": "Escrow Fees 8yrs 2010-2016",
 *        "costCategories": [
 *            "Communication     aa",
 *            "Meals & Entertainment",
 *            "Mileage",
 *            "Miscellaneous",
 *            "Z - RITC",
 *            "Supplies/Postage",
 *            "Z - GST/HST",
 *            "Airfare",
 *            "Car Rentl, Parking, Toll",
 *            "Hotel",
 *            "Taxi"
 *        ]
 *    },
 *    ...
 *    {
 *        "Assignment": "Client Billable",
 *        "Project Name": "Implement: R",
 *        "costCategories": [
 *            "Communication     aa",
 *            "Meals & Entertainment",
 *            "Mileage",
 *            "Miscellaneous",
 *            "Z - RITC",
 *            "Supplies/Postage",
 *            "Z - GST/HST",
 *            "Airfare",
 *            "Car Rentl, Parking, Toll",
 *            "Hotel",
 *            "Taxi"
 *        ]
 *    }
 * ]
 */
	router.get('/mapping', function(req, res) {
		gp.getProjectsJson(req, res, function(projectJson) {
			res.json(projectJson);
		});	
	});	

	return router;
};
