var express = require('express'),
    session = require('express-session'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
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
    .get(function(req, res) {
	    activityController.getActivities(req, res, function(activities) {
		res.json(activities); 
	    });
    })
    .post(function(req, res) {
	    activityController.newActivity(req, res, function(activitiy) {
		res.json(activity);	    
	    });
    });

router.get('/new', function(req, res) {
    res.render('activities/new', { title: 'Add new activity' });
});

router.param('id', function(req, res, next, id) {
	activityController.verifyActivityId(req, res, next, id);
});

router.route('/:id')
  .get(function(req, res) {
	  activityController.getActivityById(req, res, function(activity) {
		res.json(activity);
	  });
  });

module.exports = router;
