var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var config = require('../config');
var server = require('../app');
var Quixpense = require('../models/quixpense');
var usersController = require('../controllers/users');

chai.use(chaiHttp);

var token = ''; 

describe('Users', function() {
	var update = {
		expCurrency: "CAD",
		reimbCurrency: "CAD"
	};

	beforeEach(function(done) {
		Quixpense.User.findOneAndUpdate({username: config.test.username}, update, {new: true, upsert: true}, function(err, user) { done(); });	
	});

	afterEach(function(done) {
		Quixpense.User.findOneAndUpdate({username: config.test.username}, update, {new: true, upsert: true}, function(err, user) { done(); });	
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
	it('should list USER details for User on /user GET', function(done) {
		chai.request(server)
			.get('/user')
			.set('Authorization', token)
			.end(function(err, res) {
				res.should.have.status(200);
				r = res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.a.property('id');
				res.body.should.have.a.property('username');
				res.body.should.have.a.property('firstname');
				res.body.should.have.a.property('lastname');
				res.body.should.have.a.property('email');
				res.body.should.have.a.property('expCurrency');
				res.body.should.have.a.property('reimbCurrency');

				done();
			});	
	});	
	it('should update USER details for User on /user PUT', function(done) {
		chai.request(server)
			.put('/user')
			.set('Authorization', token)
			.send({ expCurrency: 'USD', reimbCurrency: 'USD' })
			.end(function(err, res) {
				res.should.have.status(200);
				r = res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.a.property('id');
				res.body.should.have.a.property('username');
				res.body.should.have.a.property('firstname');
				res.body.should.have.a.property('lastname');
				res.body.should.have.a.property('email');
				res.body.should.have.a.property('expCurrency');
				res.body.should.have.a.property('reimbCurrency');

				res.body.expCurrency.should.equal('USD');
				res.body.reimbCurrency.should.equal('USD');
				done();
			});	
	});	
	it('should submit feedback by User on /user/feedback POST', function(done) {
		chai.request(server)
			.post('/user/feedback')
			.set('Authorization', token)
			.send({ feedback: 'Test feedback!'})
			.end(function(err, res) {
				res.should.have.status(200);
				r = res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.a.property('feedback');

				res.body.feedback.should.equal('Test feedback!');
				done();
			});	
	});	
});
