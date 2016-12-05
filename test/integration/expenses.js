process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var config = require('../../config');
var server = require('../../app');
var Quixpense = require('../../models/quixpense');
var receiptsController = require('../../controllers/receipts');
var projectsController = require('../../controllers/projects');
var expensesController = require('../../controllers/expenses');

chai.use(chaiHttp);

var token = ''; 
var imgpath1 = "/home/jhadi/rl/quixpense/quixpense-server/test/test.jpg";
var img1length = '1780541';
var imgpath2 = "/home/jhadi/rl/quixpense/quixpense-server/test/test2.jpg";
var img2length = '464967';
var imgpath3 = "/home/jhadi/rl/quixpense/quixpense-server/test/test3.jpg";

var projectid1 = '';
var projectid2 = '';
var receiptid1 = '';
var receiptid2 = '';
var receiptid3 = '';

describe('Expenses', function() {
	before(function(done) {
		Quixpense.Expense.collection.drop();
		Quixpense.Project.collection.drop();
		Quixpense.Receipt.collection.drop();
		done();
	});

	after(function(done) {
		//Quixpense.Expense.collection.drop();
		//Quixpense.Project.collection.drop();
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
	}).timeout(10000);
	it('should create new RECEIPT 1 for User on /receipts POST', function(done) {
		chai.request(server)
			.post('/receipts')
			.set('Authorization', token)
			.field('description', 'Receipt 1.')
			.field('where', 'O')
			.field('type', 'Taxi')
			.field('amount', 12.50)
			.field('date', '2016/11/01')
			.attach('img', imgpath1)
			.end(function(err, res) {
				res.should.have.status(200);
				r = res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.a.property('_id');
				res.body.should.have.a.property('userId');
				res.body.should.have.a.property('where');
				res.body.should.have.a.property('type');
				res.body.should.have.a.property('amount');
				res.body.should.have.a.property('description');
				res.body.should.have.a.property('submitted');

				res.body.where.should.equal('O');
				res.body.type.should.equal('Taxi');
				res.body.amount.should.equal(12.50);
				res.body.date.should.equal('2016-11-01T04:00:00.000Z');
				res.body.description.should.equal('Receipt 1.');

				receiptid1 = res.body._id;

				done();
			});	
	}).timeout(10000);	
	it('should create new PROJECT "UGC 2016 Toronto" for User on /projects POST', function(done) {
		chai.request(server)
			.post('/projects')
			.set('Authorization', token)
			.send({ 
				description: 'Stuff for UGC Toronto 2016',
			       	name: 'UGC 2016 Toronto', 
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

				res.body.name.should.equal('UGC 2016 Toronto');
				res.body.description.should.equal('Stuff for UGC Toronto 2016');
				res.body.assignment.should.equal('UGC');

				projectid1 = res.body._id;

				done();
			});	
	}).timeout(10000);	
	it('should create new PROJECT "ASHRM 2016" for User on /projects POST', function(done) {
		chai.request(server)
			.post('/projects')
			.set('Authorization', token)
			.send({ 
				description: 'Stuff for ASHRM 2016',
			       	name: 'ASHRM 2016', 
			       	assignment: 'Conference (Mkt Exp)' 
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

				res.body.name.should.equal('ASHRM 2016');
				res.body.description.should.equal('Stuff for ASHRM 2016');
				res.body.assignment.should.equal('Conference (Mkt Exp)');

				projectid2 = res.body._id;

				done();
			});	
	}).timeout(10000);	
	it('should create new RECEIPT 2 for User on /receipts POST', function(done) {
		chai.request(server)
			.post('/receipts')
			.set('Authorization', token)
			.field('description', 'Receipt 2.')
			.field('where', 'O')
			.field('type', 'Hotel')
			.field('amount', 193.50)
			.field('date', '2016/11/02')
			.field('parentProject', projectid2)
			.attach('img', imgpath2)
			.end(function(err, res) {
				res.should.have.status(200);
				r = res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.a.property('_id');
				res.body.should.have.a.property('userId');
				res.body.should.have.a.property('where');
				res.body.should.have.a.property('type');
				res.body.should.have.a.property('amount');
				res.body.should.have.a.property('description');
				res.body.should.have.a.property('submitted');

				res.body.where.should.equal('O');
				res.body.type.should.equal('Hotel');
				res.body.amount.should.equal(193.50);
				res.body.date.should.equal('2016-11-02T04:00:00.000Z');
				res.body.description.should.equal('Receipt 2.');
				res.body.parentProject.should.equal(projectid2);

				receiptid2 = res.body._id;

				done();
			});	
	}).timeout(10000);	
	it('should update RECEIPT 1 by ID /receipts/:receiptid PUT', function(done) {
		chai.request(server)
			.put('/receipts/' + receiptid1)
			.set('Authorization', token)
			.field('parentProject', projectid1)
			.end(function(err, res) {
				res.should.have.status(200);
				r = res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.a.property('_id');
				res.body.should.have.a.property('userId');
				res.body.should.have.a.property('where');
				res.body.should.have.a.property('type');
				res.body.should.have.a.property('amount');
				res.body.should.have.a.property('description');
				res.body.should.have.a.property('submitted');

				res.body.parentProject.should.equal(projectid1);

				done();
			});	
	}).timeout(10000);	
	it('should create new RECEIPT 3 for User on /receipts POST', function(done) {
		chai.request(server)
			.post('/receipts')
			.set('Authorization', token)
			.field('description', 'Receipt 3.')
			.field('where', 'O')
			.field('type', 'Meal & Entertainmt')
			.field('amount', 93.80)
			.field('date', '2016/11/02')
			.field('parentProject', projectid1)
			.attach('img', imgpath3)
			.end(function(err, res) {
				res.should.have.status(200);
				r = res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.a.property('_id');
				res.body.should.have.a.property('userId');
				res.body.should.have.a.property('where');
				res.body.should.have.a.property('type');
				res.body.should.have.a.property('amount');
				res.body.should.have.a.property('description');
				res.body.should.have.a.property('submitted');

				res.body.where.should.equal('O');
				res.body.type.should.equal('Meal & Entertainmt');
				res.body.amount.should.equal(93.80);
				res.body.date.should.equal('2016-11-02T04:00:00.000Z');
				res.body.description.should.equal('Receipt 3.');

				receiptid3 = res.body._id;

				done();
			});	
	}).timeout(10000);	
	it('should get RECEIPTS by PROJECT /projects/:id/receipts GET', function(done) {
		chai.request(server)
			.get('/projects/' + projectid1 + '/receipts') 
			.set('Authorization', token)
			.end(function(err, res) {
				//console.log(res.body[0]);
				res.should.have.status(200);
				r = res.should.be.array;
				res.body[0].should.have.a.property('_id');
				res.body[0].should.have.a.property('userId');
				res.body[0].should.have.a.property('where');
				res.body[0].should.have.a.property('type');
				res.body[0].should.have.a.property('amount');

				res.body.length.should.equal(2);

				done();
			});	
	}).timeout(10000);	


	it('should create new EXPENSE for User on /expenses POST', function(done) {
		chai.request(server)
			.post('/expenses')
			.set('Authorization', token)
			.send({ 
				projects: [ projectid1, projectid2 ]
			})
			.end(function(err, res) {
				res.should.have.status(200);
				r = res.should.be.json;
				
				//console.log(res.body);

				done();
			});	
	}).timeout(10000);	
});
