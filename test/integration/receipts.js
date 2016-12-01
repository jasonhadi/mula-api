var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var config = require('../../config');
var server = require('../../app');
var Quixpense = require('../../models/quixpense');
var receiptsController = require('../../controllers/receipts');

chai.use(chaiHttp);

var token = ''; 
var imgpath1 = "/home/jhadi/rl/quixpense/quixpense-server/test/test.jpg";
var img1length = '1780541';
var imgpath2 = "/home/jhadi/rl/quixpense/quixpense-server/test/test2.jpg";
var img2length = '464967';
var receiptid = '';

describe('Receipts', function() {
	before(function(done) {
		Quixpense.Receipt.collection.drop();
		done();
	});

	after(function(done) {
		Quixpense.Receipt.collection.drop();
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
	it('should create new RECEIPT for User on /receipts POST', function(done) {
		chai.request(server)
			.post('/receipts')
			.set('Authorization', token)
			.field('description', 'Test description.')
			.field('where', 'O')
			.field('type', 'Taxi')
			.field('amount', 12.50)
			.field('date', '2016/12/01')
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
				res.body.date.should.equal('2016-12-01T05:00:00.000Z');
				res.body.description.should.equal('Test description.');

				receiptid = res.body._id;

				done();
			});	
	});	
	it('should get RECEIPT 1 pdf for User on /receipts/:receiptid/img POST', function(done) {
		chai.request(server)
			.get('/receipts/' + receiptid + '/img')
			.set('Authorization', token)
			.end(function(err, res) {
				res.should.have.status(200);
				res.headers['content-type'].should.equal('application/pdf');
				res.headers['content-length'].should.equal(img1length);

				done();
			});	
	});	
	it('should update RECEIPT 2 by ID /receipts/:receiptid PUT', function(done) {
		chai.request(server)
			.put('/receipts/' + receiptid)
			.set('Authorization', token)
			.field('description', 'Test update.')
			.field('where', 'U')
			.field('type', 'Hotel')
			.field('amount', 120.50)
			.field('date', '2016/11/01')
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

				res.body.where.should.equal('U');
				res.body.type.should.equal('Hotel');
				res.body.amount.should.equal(120.50);
				res.body.date.should.equal('2016-11-01T04:00:00.000Z');
				res.body.description.should.equal('Test update.');

				done();
			});	
	});	
	it('should get RECEIPT 2 pdf for User on /receipts/:receiptid/img POST', function(done) {
		chai.request(server)
			.get('/receipts/' + receiptid + '/img')
			.set('Authorization', token)
			.end(function(err, res) {
				res.should.have.status(200);
				res.headers['content-type'].should.equal('application/pdf');
				res.headers['content-length'].should.equal(img2length);

				done();
			});	
	});	
	it('should delete RECEIPT for User on /receipts/:receiptid DELETE', function(done) {
		chai.request(server)
			.delete('/receipts/' + receiptid)
			.set('Authorization', token)
			.end(function(err, res) {
				res.should.have.status(200);
				r = res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.a.property('status');
				res.body.should.have.a.property('receipt');

				res.body.status.should.equal('success');
				res.body.receipt._id.should.equal(receiptid);

				done();
			});	
	});	
});
