// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const app = require('../index'); // Import your Express app

// chai.use(chaiHttp);
// const expect = chai.expect;

// describe('User Profile Retrieval API', () => {
//   it('should retrieve a user profile by ID', (done) => {
//     const userId = "65472f93a3d241ee67244957";
//     chai.request(app)
//       .get(`/customer/profile-by-id/${userId}`)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('object');
//         expect(res.body.data.user.name).to.equal('test user1');
//         done();
//       });
//   });

//   it('should return a 404 status for a non-existent user', (done) => {
//     const nonExistentUserId = 999;
//     chai.request(app)
//       .get(`/api/user/profile/${nonExistentUserId}`)
//       .end((err, res) => {
//         expect(res).to.have.status(404);
//         done();
//       });
//   });
// });
