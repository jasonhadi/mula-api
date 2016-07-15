var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    fs = require('fs'),
    multer = require('multer');

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
        mongoose.model('Receipt').find({}, function (err, activities) {
              if (err) { return console.error(err); }
	      else { res.json(activities); }     
        });
    })
    .post(function(req, res) {
	var activityId = req.body.activityId;
	var imgId = req.body.imgId;
	var where = req.body.where;
	var type = req.body.type;
    	var value = req.body.value;
	var created = req.body.created;
	var lastUpdated = req.body.lastUpdated;

        mongoose.model('Activity').findById(activityId, function (err, activity) {
		console.log( JSON.stringify(activity) );
		if (err) { 
			console.log('Activity ' + id + ' was not found');
			res.status(500);
			err = new Error('Activity ID Not Found');
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else {
			mongoose.model('Receipt').create({
				where: where,
				type: type,
				value: value,
				imgId: imgId,
				parentActivity: activityId,
				parentExpense: activityId.parentExpense,
				created: created,
				lastUpdated: lastUpdated
			}, function (err, receipt) {
				if(err) {
					console.log("Could not create Receipt!");
					res.status(500);
					err = new Error("Could not create Receipt!");
					err.status = 500;
					res.json({message : err.status  + ' ' + err});
				} else {
					console.log( JSON.stringify(activity) );
					activity.receipts.push(receipt);
					activity.lastUpdated = new Date();
					mongoose.model('Expense').update( { _id: activity.parentExpense }, { $set: { lastUpdated: new Date() }}, { } );
					activity.save(function (err) {
						if (err) {
							console.log("Could not save Activity!");
							res.status(500);
							err = new Error("Could not save Activity!");
							err.status = 500;
							res.json({message : err.status  + ' ' + err});
						} else {
							res.json(activity);
						}
					});
				}
			});

		}
	});
    });

router.get('/new', function(req, res) {
    res.render('receipts/new', { title: 'Add new receipt' });
});

router.route('/img')
    .get(function(req, res) {
	    res.render('receipts/newimg', { title: 'Add new image' });
    })
    .post(function(req, res) { 
	var data = req.body.data;
	var contentType = req.body.type;

	console.log( JSON.stringify(req.files) );

	mongoose.model('Image').create({
		img: {
			data: data,
			contentType: contentType
		}
	}, function (err, image) {
		if(err) {
			console.log("Could not create Image!");
			res.status(500);
			err = new Error("Could not create Image!");
			err.status = 500;
			res.json({message : err.status  + ' ' + err});
		} else {
			console.log( JSON.stringify(image) );
			res.contentType(image.img.contentType);			
			res.send(image.img.data);
		}
	});

    });

router.get('/img/new', function(req, res) {
    res.render('receipts/newimg', { title: 'Add new image' });
});

router.param('img_id', function(req, res, next, id) {
    mongoose.model('Image').findById(id, function (err, activity) {
        if (err) {
            console.log(id + ' image was not found');
            res.status(404);
            err = new Error('Image ID Not Found');
            err.status = 404;
	    res.json({message : err.status  + ' ' + err});
        } else {
            console.log(activity);
            req.id = id;
            next(); 
        } 
    });
});

router.route('/img/:img_id')
   .get(function(req, res) {
   	mongoose.model('Image').findById(req.img_id, function (err, image) {
   		if (err) {
   			console.log('GET Error: There was a problem retrieving: ' + err);
   		} else {
   			console.log('GET Retrieving ID: ' + image._id);
			res.contentType(image.img.contentType);			
			res.send(image.img.data);
   		}
   	});
   });

router.param('id', function(req, res, next, id) {
    mongoose.model('Receipt').findById(id, function (err, receipt) {
        if (err) {
            console.log(id + ' was not found');
            res.status(404);
            err = new Error('ID Not Found');
            err.status = 404;
	    res.json({message : err.status  + ' ' + err});
        } else {
            console.log(receipt);
            req.id = id;
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Receipt').findById(req.id, function (err, receipt) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + receipt._id);
	res.json(receipt);
      }
    });
  });


module.exports = router;
