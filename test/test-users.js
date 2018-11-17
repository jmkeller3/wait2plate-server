"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");
const User = require("../models/User");
const { TEST_DATABASE_URI } = require("../config");

const expect = chai.expect;

chai.use(chaiHttp);

describe("/api/users", () => {
  const username = "exampleUser";
  const password = "examplePass";
  const email = "exampleEmail";
  const usernameB = "exampleUserB";
  const passwordB = "examplePassB";
  const emailB = "exampleEmailB";
});

before(() => {
  runServer(TEST_DATABASE_URI);
});

after(() => {
  closeServer();
});

beforeEach(() => {
  {
  }
});

afterEach(() => {
  User.remove({});
});

describe("/api/users", () => {
  describe("POST", () => {
    it("Should reject users with missing username", () => {
      chai
        .request(app)
        .post("/api/users")
        .send({
          password,
          email
        })
        .then(() => expect.fail(null, null, "Request should not succeed"))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal("Missing field");
          expect(res.body.location).to.equal("username");
        });
    });
    it("Should reject users with missing password", () => {
      chai
        .request(app)
        .post("/api/users")
        .send({
          username,
          email
        })
        .then(() => expect.fail(null, null, "Request should not succeed"))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal("Missing field");
          expect(res.body.location).to.equal("password");
        });
    });
    it("Should reject users with non-string username", () => {
      chai
        .request(app)
        .post("/api/users")
        .send({
          username: 1234,
          email,
          password
        })
        .then(() => expect.fail(null, null, "Request should not succeed"))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal(
            "Incorrect field type: expected string"
          );
          expect(res.body.location).to.equal("username");
        });
    });
    it("Should reject users with non-string password", () => {
      chai
        .request(app)
        .post("/api/users")
        .send({
          username,
          email,
          password: 1234
        })
        .then(() => expect.fail(null, null, "Request should not succeed"))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal(
            "Incorrect field type: expected string"
          );
          expect(res.body.location).to.equal("password");
        });
    });
    it("Should reject users with non-string username", () => {
      chai
        .request(app)
        .post("/api/users")
        .send({
          username,
          email: 1234,
          password
        })
        .then(() => expect.fail(null, null, "Request should not succeed"))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal(
            "Incorrect field type: expected string"
          );
          expect(res.body.location).to.equal("email");
        });
    });
  });
});
