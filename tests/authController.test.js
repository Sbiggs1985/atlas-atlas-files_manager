const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../controllers/AuthController');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

chai.use(chaiHttp);
const { expect } = chai;

describe('AuthController', () => {
  let token;

  before(async () => {
    await dbClient.db.collection('users').insertOne({
      email: 'testuser@example.com',
      password: 'hashedpassword',
    });
  });

  after(async () => {
    await dbClient.db.collection('users').deleteMany({});
    redisClient.flushall();
  });

  describe('GET /connect', () => {
    it('should authenticate the user and return a token', (done) => {
      chai.request(app)
        .get('/connect')
        .set('Authorization', 'Basic ' + Buffer.from('testuser@example.com:password').toString('base64'))
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          token = res.body.token;
          done();
        });
    });

    it('should return 401 for invalid credentials', (done) => {
      chai.request(app)
        .get('/connect')
        .set('Authorization', 'Basic ' + Buffer.from('wronguser@example.com:wrongpassword').toString('base64'))
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error', 'Unauthorized');
          done();
        });
    });
  });

  describe('GET /disconnect', () => {
    it('should logout the user and remove the token from Redis', (done) => {
      chai.request(app)
        .get('/disconnect')
        .set('X-Token', token)
        .end((err, res) => {
          expect(res).to.have.status(204);
          done();
        });
    });

    it('should return 401 if token is invalid', (done) => {
      chai.request(app)
        .get('/disconnect')
        .set('X-Token', 'invalid-token')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error', 'Unauthorized');
          done();
        });
    });
  });
});