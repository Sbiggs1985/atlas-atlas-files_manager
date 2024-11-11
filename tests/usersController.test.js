const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../controllers/UsersController');

chai.use(chaiHttp);
const { expect } = chai;

describe('UsersController', () => {
  let token;

  before(async () => {
    const res = await chai.request(app)
      .get('/connect')
      .set('Authorization', 'Basic ' + Buffer.from('testuser@example.com:password').toString('base64'));
    token = res.body.token;
  });

  after(async () => {
    await dbClient.db.collection('users').deleteMany({});
  });

  describe('GET /users/me', () => {
    it('should retrieve the user information for authenticated user', (done) => {
      chai.request(app)
        .get('/users/me')
        .set('X-Token', token)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('email', 'testuser@example.com');
          done();
        });
    });

    it('should return 401 if token is invalid or expired', (done) => {
      chai.request(app)
        .get('/users/me')
        .set('X-Token', 'invalid-token')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error', 'Unauthorized');
          done();
        });
    });
  });
});