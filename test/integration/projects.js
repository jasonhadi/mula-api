var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var config = require('../../config');
var server = require('../../app');
var Quixpense = require('../../models/quixpense');
var projectsController = require('../../controllers/projects');

chai.use(chaiHttp);

var token = ''; 
var projectid1 = '';
var projectid2 = '';


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

				projectid1 = res.body._id;

				done();
			});	
	});	
	it('should get PROJECT by ID /projects/:id GET', function(done) {
		chai.request(server)
			.get('/projects/' + projectid1)
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
			.put('/projects/' + projectid1)
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
			.delete('/projects/' + projectid1)
			.set('Authorization', token)
			.end(function(err, res) {
				res.should.have.status(200);
				r = res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.a.property('status');
				res.body.should.have.a.property('project');

				res.body.status.should.equal('success');
				res.body.project._id.should.equal(projectid1);

				done();
			});	
	});	

	it('should create multiple PROJECT for User on /projects/batch POST', function(done) {
		chai.request(server)
			.post('/projects/batch')
			.set('Authorization', token)
			.send({ projects: [ 
				{
					description: 'Test description.',
			       		name: 'UGC 2016', 
			       		assignment: 'UGC' 
				},
				{
					description: 'Test description 2.',
			       		name: 'UGC 2016 2', 
			       		assignment: 'UGC 2' 
				}
			]})
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.a.property('count');
				res.body.should.have.a.property('projects');
				res.body.should.have.a.property('status');

				res.body.status.should.equal('success');
				res.body.count.should.equal(2);
				res.body.projects.length.should.equal(2);

				projectid1 = res.body.projects[0]._id;
				projectid2 = res.body.projects[1]._id;

				done();
			});	
	});	
	it('should update multiple PROJECT for User on /projects/batch POST', function(done) {
		chai.request(server)
			.put('/projects/batch')
			.set('Authorization', token)
			.send({ projects: [ 
				{
					_id: projectid1,
					description: 'Test description update.',
				},
				{
					_id: projectid2,
					description: 'Test description update 2.',
				}
			]})
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.a.property('count');
				res.body.should.have.a.property('status');

				res.body.status.should.equal('success');
				res.body.count.should.equal(2);

				done();
			});	
	});	
	it('verify multiple PROJECT update /projects/:id GET', function(done) {
		chai.request(server)
			.get('/projects/' + projectid1)
			.set('Authorization', token)
			.end(function(err, res) {
				res.should.have.status(200);
				r = res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.a.property('_id');
				res.body.should.have.a.property('description');

				res.body.description.should.equal('Test description update.');

				done();
			});	
	});	
	it('should delete multiple PROJECT for User on /projects/batch DELETE', function(done) {
		chai.request(server)
			.delete('/projects/batch')
			.set('Authorization', token)
			.send({ projects: [ 
					projectid1,
					projectid2
				]
			})
			.end(function(err, res) {
				console.log(res.body);
				res.should.have.status(200);
				res.body.should.have.a.property('count');
				res.body.should.have.a.property('status');

				res.body.status.should.equal('success');
				res.body.count.should.equal(2);

				done();
			});	
	});	
	it('verify multiple PROJECT delete /projects/:id GET', function(done) {
		chai.request(server)
			.get('/projects/' + projectid1)
			.set('Authorization', token)
			.end(function(err, res) {
				r = res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.a.property('message');

				res.body.message.should.equal('500 Project not found.');

				done();
			});	
	});	
});
