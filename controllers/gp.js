var async = require('async');
var mssql = require('../models/mssql');
var config = require('../config');

function getProjects(req, res, next) {
	mssql.query("SELECT DISTINCT [Project Name] FROM [RLINC].[dbo].[_projectList] WHERE [Project Name] NOT LIKE 'Expenses%'", function(err, recordset) {
		if(err) { return next(err); }
		else { return next( recordset.map( function(r) { return r["Project Name"]; })); }
	});
}

function getAssignments(req, res, next) {
	mssql.query('SELECT DISTINCT [Assignment] FROM [RLINC].[dbo].[_costCategoryByAssignment]', function(err, recordset) {
		if(err) { return next(err); }
		else { return next( recordset.map( function(r) { return r.Assignment; })); }
	});
}

function getCostCategories(req, res, next) {
	mssql.query('SELECT DISTINCT [Cost Category Name] FROM [RLINC].[dbo].[_costCategoryByAssignment]', function(err, recordset) {
		if(err) { return next(err); }
		else { return next( recordset.map( function(r) { return r["Cost Category Name"]; })); }
	});
}

function getProjectsJson(req, res, next) {
	function generate(assignments, costCategories, projects, next) {
		assignments.forEach(function(a) {
			costCategory = mapCostCategoriestoAssignment(costCategories, a.Assignment);

			//Transportation & Hotel Replacement
			thIndex = costCategory.indexOf('Transportation & Hotel');
			if(thIndex > -1) {
				costCategory.pop(thIndex);
				costCategory.push('Airfare', 'Car Rentl, Parking, Toll', 'Hotel', 'Taxi');
			}

			//Remove duplicate - sometimes Meals & Ent are there twice
			costCategory = removeDuplicates(costCategory);
			mapCostCategorytoProject(costCategory, a.Assignment, projects);	
		});	
		next(projects);
	}

	function removeDuplicates(a) {
		return a.filter( function(item, index, inputArray) {
			return inputArray.indexOf(item) == index;
		});
	}

	function mapCostCategoriestoAssignment(costCategories, assignment) {
		return costCategories.filter(function(c) { 
			return (c.Assignment === assignment);
		}).map(function(c) {
			return c['Cost Category Name'];
		});
	}

	function mapCostCategorytoProject(costCategory, assignment, projects) {
		return projects.map(function(p) {
			if(p.Assignment === assignment) {
				p.costCategories = costCategory;
			}
			return p;
		});
	}

	function remapCostCategorytoSheet(costCategory, map) {
		return costCategory.map(function(c) {
				
		});
	}

	async.parallel({
		projects: function(callback) {
			mssql.query("SELECT [Project Name],[Assignment] FROM [RLINC].[dbo].[_projectList] WHERE [Project Name] NOT LIKE 'Expenses%'", function(err, recordset) {
				callback(err, recordset);
			});
		},
		assignments: function(callback) {
			mssql.query("SELECT DISTINCT [Assignment] FROM [RLINC].[dbo].[_costCategoryByAssignment]", function(err, recordset) {
				callback(err, recordset);
			});
		},
		costCategories: function(callback) {
			mssql.query("SELECT [Assignment], [Cost Category Name] FROM [RLINC].[dbo].[_costCategoryByAssignment]", function(err, recordset) {
				callback(err, recordset);
			});
		}
	}, function(err, results) {
		//next(results);
		//var a = mapCostCategoriestoAssignment(results.costCategories, 'Client Billable');
		//var b = mapCostCategorytoProject(a, 'Client Billable', results.projects);

		generate(results.assignments, results.costCategories, results.projects, next);
	});
}

module.exports = {
	getCostCategories: getCostCategories,
	getProjects: getProjects,
	getProjectsJson: getProjectsJson,
	getAssignments: getAssignments
};
