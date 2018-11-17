"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");

const { app, runServer, closeServer } = require("../server");

const { JWT_SECRET, TEST_DATABASE_URI } = require("../config");

const expect = chai.expect();

chai.use(chaiHttp);

describe("Protected endpoint", function() {
  //const id = Math.floor(Math.random * 100);
  const username = "exampleUser";
  const email = "exampleEmail";
  const password = "examplePassword";

  before(function() {
    return runServer(TEST_DATABASE_URI);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    return username.hashPassword(password).then(password =>
      username.create({
        username,
        email,
        password
      })
    );
  });

  afterEach(function() {
    return User.remove({});
  });

  describe("/api/protected", function() {
    it("Should reject requests with no credentials", function() {
      return chai
        .request(app)
        .then(() => expect.fail(null, null, "Request should not succeed"));
    }).catch(err => {
      if (err instanceof chai.AssertionError) {
        throw err;
      }

      const res = err.response;
      expect(res).to.have.status(401);
    });
  });

  it("Should reject requests with an invalid token", function() {
    const token = jwt.sign(
      {
        username,
        email
      },
      "wrongSecret",
      {
        algorithm: "HS256",
        expiresIn: "7d"
      }
    );

    return chai
      .request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${token}`)
      .then(() => expect.fail(null, null, "Request should not succeed"))
      .catch(err => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }

        const res = err.response;
        expect(res).to.have.status(401);
      });
  });

  it("Should reject requests with an expired token", function() {
    const token = jwt.sign(
      {
        user: {
          username,
          email
        },
        exp: Math.floor(Date.now() / 1000) - 10
      },
      JWT_SECRET,
      {
        algorithm: "HS256",
        subject: username
      }
    );

    return chai
      .request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${token}`)
      .then(() => expect.fail(null, null, "Request should not succeed"))
      .catch(err => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }

        const res = err.response;
        expect(res).to.have.status(401);
      });
  });

  it("Should send protected data", function() {
    const token = jwt.sign(
      {
        user: {
          username,
          email
        }
      },
      JWT_SECRET,
      {
        algorithm: "HS256",
        subject: username,
        expiresIn: "7d"
      }
    );

    return chai
      .request(app)
      .get("/api/protected")
      .set("authorization", `Bearer ${token}`)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.data).to.equal("snoopy");
      });
  });
});
