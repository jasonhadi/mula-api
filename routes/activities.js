var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

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
    .get(function(req, res, next) {
        mongoose.model('Activity').find({}, function (err, activities) {
              if (err) { return console.error(err); }
	      else { res.json(activities); }     
        });
    })
    .post(function(req, res) {
	var expenseId = req.body.expenseId;
    	var number = req.body.number;
	var type = req.body.type;
    	var clientName = req.body.clientName;
	var project = req.body.project;
	var description = req.body.description;
	var created = req.body.created;
	var lastUpdated = req.body.lastUpdated;

        mongoose.model('Expense').findById(expenseId, function (err, expense) {
		console.log( JSON.stringify(expense) );
		if (err) { 
			console.log('Expense ' + id + ' was not found');
			res.status(500);
			err = new Error('Expense ID Not Found');
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else {
			mongoose.model('Activity').create({
				number: number,
				type: type,
				clientName: clientName,
				project: project,
				description: description,
				created: created,
				lastUpdated: lastUpdated
			}, function (err, activity) {
				if(err) {
					console.log("Could not create Activity!");
					res.status(500);
					err = new Error("Could not create Activity!");
					err.status = 500;
					res.json({message : err.status  + ' ' + err});
				} else {
					console.log( JSON.stringify(activity) );
					expense.activities.push(activity);
					expense.lastUpdated = new Date();
					expense.save(function (err) {
						if (err) {
							console.log("Could not create Activity!");
							res.status(500);
							err = new Error("Could not create Activity!");
							err.status = 500;
							res.json({message : err.status  + ' ' + err});
						} else {
							res.json(expense);
						}
					});
				}
			});

		}

	});
    });

router.get('/new', function(req, res) {
    res.render('activities/new', { title: 'Add new activity' });
});

router.param('id', function(req, res, next, id) {
    mongoose.model('Activity').findById(id, function (err, activity) {
        if (err) {
            console.log(id + ' was not found');
            res.status(404);
            err = new Error('ID Not Found');
            err.status = 404;
	    res.json({message : err.status  + ' ' + err});
        } else {
            console.log(activity);
            req.id = id;
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Activity').findById(req.id, function (err, activity) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + activity._id);
	res.json(activity);
      }
    });
  });



module.exports = router;
