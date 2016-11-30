var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var config = require('../../config');
var server = require('../../app');
var Quixpense = require('../../models/quixpense');
var receiptsController = require('../../controllers/receipts');

chai.use(chaiHttp);

var token = ''; 
var imgpath = "/home/jhadi/rl/quixpense/quixpense-server/test/test.jpg";

describe('Receipts', function() {
	before(function(done) {
		Quixpense.Receipt.collection.drop();
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
	it('should create new RECEIPT for User on /receipts POST', function(done) {
		chai.request(server)
			.post('/receipts')
			.set('Authorization', token)
			.field('description', 'Test description.')
			.field('where', 'O')
			.field('type', 'Taxi')
			.field('amount', 12.50)
			.field('date', '2016/12/01')
			.attach('img', imgpath)
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

				done();
			});	
	});	
});
