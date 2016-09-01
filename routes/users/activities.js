var express = require('express'),
    session = require('express-session'),
    router = express.Router({mergeParams: true}),
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    activityController = require('../../controllers/activities');

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
	    activityController.newActivity(req, res, function(activity) {
		res.json(activity);	    
	    });
    });

router.param('activityid', function(req, res, next, activityid) {
	activityController.verifyActivityId(req, res, next, activityid);
});

router.route('/:activityid')
  .get(function(req, res) {
	  activityController.getActivity(req, res, function(activity) {
		res.json(activity);
	  });
  })
  .put(function(req, res) {
	  activityController.updateActivity(req, res, function(activity) {
		res.json(activity);
	  });
  })
  .delete(function(req, res) {
	  activityController.deleteActivity(req, res, function(activity) {
		res.json(activity);
	  });
  });

module.exports = router;
