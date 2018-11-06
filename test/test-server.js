const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, closeServer, runServer } = require("../server");

const should = chai.should();
chai.use(chaiHttp);

describe("API", function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });

  it("should 200 on users GET requests", function() {
    return chai
      .request(app)
      .get("/api/users")
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
      });
  });

  it("should 200 on reports GET requests", function() {
    return chai
      .request(app)
      .get("/api/reports")
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
      });
  });
});
