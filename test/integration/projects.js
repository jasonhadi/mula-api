var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var config = require('../../config');
var server = require('../../app');
var Quixpense = require('../../models/quixpense');
var projectsController = require('../../controllers/projects');

chai.use(chaiHttp);

var token = ''; 
var projectid = '';

describe('Projects', function() {
	before(function(done) {
		Quixpense.Project.collection.drop();
		done();
	});

	after(function(done) {
		//Quixpense.Receipt.collection.drop();
		done();
	});

	it('should get an auth token for User on /auth POST', function(done) {
		chai.request(server)
			.post('/auth')
			.send({ username: config.test.username, password: config.test.password })
			.end(function(err, res) {
				res.should.have.status(200);
				r = res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.a.property('token');
				
				token = 'Bearer ' + res.body.token;

				done();
			});
	});
	it('should create new PROJECT for User on /projects POST', function(done) {
		chai.request(server)
			.post('/projects')
			.set('Authorization', token)
			.send({ 
				description: 'Test description.',
			       	name: 'UGC 2016', 
			       	assignment: 'UGC' 
			})
			.end(function(err, res) {
				res.should.have.status(200);
				r = res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.a.property('_id');
				res.body.should.have.a.property('userId');
				res.body.should.have.a.property('name');
				res.body.should.have.a.property('description');
				res.body.should.have.a.property('assignment');

				res.body.name.should.equal('UGC 2016');
				res.body.description.should.equal('Test description.');
				res.body.assignment.should.equal('UGC');

				projectid = res.body._id;

				done();
			});	
	});	
	it('should get PROJECT by ID /projects/:id GET', function(done) {
		chai.request(server)
			.get('/projects/' + projectid)
			.set('Authorization', token)
			.end(function(err, res) {
				res.should.have.status(200);
				r = res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.a.property('_id');
				res.body.should.have.a.property('userId');
				res.body.should.have.a.property('name');
				res.body.should.have.a.property('description');
				res.body.should.have.a.property('assignment');

				res.body.name.should.equal('UGC 2016');
				res.body.description.should.equal('Test description.');
				res.body.assignment.should.equal('UGC');

				done();
			});	
	});	
	it('should update PROJECT by ID /projects/:id PUT', function(done) {
		chai.request(server)
			.put('/projects/' + projectid)
			.set('Authorization', token)
			.send({ 
				description: 'Test update.',
			       	name: 'UGC 2017', 
			       	assignment: 'ABC' 
			})
			.end(function(err, res) {
				res.should.have.status(200);
				r = res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.a.property('_id');
				res.body.should.have.a.property('userId');
				res.body.should.have.a.property('name');
				res.body.should.have.a.property('description');
				res.body.should.have.a.property('assignment');

				res.body.name.should.equal('UGC 2017');
				res.body.description.should.equal('Test update.');
				res.body.assignment.should.equal('ABC');

				done();
			});	
	});	
	it('should delete PROJECT by ID /projects/:id DELETE', function(done) {
		chai.request(server)
			.delete('/projects/' + projectid)
			.set('Authorization', token)
			.end(function(err, res) {
				res.should.have.status(200);
				r = res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.a.property('status');
				res.body.should.have.a.property('project');

				res.body.status.should.equal('success');
				res.body.project._id.should.equal(projectid);

				done();
			});	
	});	


});
