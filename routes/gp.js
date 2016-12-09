var express = require('express'),
    router = express.Router(),
    gp = require('../controllers/gp');

/**
 * @api {get} /gp/projects Get all Projects from GP
 * @apiGroup GP
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiSuccess {Object[]} projects Object Array of Projects from GP.
 * @apiSuccess {String} projects.assignment Assignment parent of Project.
 * @apiSuccess {String} projects.type Type of Project for sorting via questionaire.
 * @apiSuccess {String} projects.displayname Display name of Project.
 * @apiSuccess {String} projects.gpname GP name of Project required for GP spreadsheet.
 * @apiSuccess {String[]} projects.costCategories String array of cost categories for the Project.
 * @apiSuccess {String} projects.costCategories.costCategory  String name of cost category for the Project.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "_id": "5849d78744866fde70c4d4f5",
 *     "assignment": "Conference (Mkt Exp)",
 *     "type": "conference",
 *     "displayname": "ASHP 2016",
 *     "gpname": "ASHP_2016: ASHP 2016",
 *     "costCategories": [
 *       "Meals & Entertainment",
 *       "Car Rentl, Parking, Toll",
 *       "Hotel",
 *       "Taxi"
 *     ]
 *   },
 *   ...
 *   {
 *     "_id": "5849d78744866fde70c4d4f6",
 *     "assignment": "Alliances",
 *     "type": "misc",
 *     "displayname": "Alliance royalties, relat",
 *     "gpname": "ALLIANCES: Alliance royalties, relat",
 *     "costCategories": [
 *       "Meals & Entertainment",
 *       "Car Rentl, Parking, Toll",
 *       "Hotel",
 *       "Taxi"
 *     ]
 *   }
 * ]  
 */
router.get('/projects', function(req, res) {
	gp.getProjects(req, res, function(projects) {
		res.json(projects);
	});	
});
/**
 * @api {get} /gp/locations Get all Locations from GP
 * @apiGroup GP
 * @apiHeader {String} Authorization Authorization token for the User. See /auth for usage.
 * @apiSuccess {Object[]} locations Array list of Locations in GP.
 * @apiSuccess {String} locations.location String name of Location.
 * @apiSuccess {String} locations.code GP code corresponding to Location.
 * @apiSuccessExample {json} Example Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "_id": "5849d75b44866fde70c4d4e4",
 *     "location": "Alberta",
 *     "code": "CAN GST"
 *   },
 *   ...
 *   {
 *     "_id": "5849d75b44866fde70c4d4e5",
 *     "location": "Ontario",
 *     "code": "O"
 *   }
 * ]
 */
router.get('/locations', function(req, res) {
	gp.getLocations(req, res, function(locations) {
		res.json(locations);
	});	
});

module.exports = router;
