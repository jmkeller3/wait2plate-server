"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");

const { app, runServer, closeServer } = require("../server");
const User = require("../models/User");
const { JWT_SECRET, TEST_DATABASE_URI } = require("../config");

const expect = chai.expect;

chai.use(chaiHttp);

describe("Protected endpoint", function() {
  const username = "exampleUser";
  const email = "exampleEmail";
  const password = "examplePassword";

  before(function() {
    return runServer(TEST_DATABASE_URI);
  });

  beforeEach(function() {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        email,
        password
      })
    );
  });

  afterEach(function() {
    return User.deleteMany({});
  });

  after(function() {
    return closeServer();
  });

  describe("/api/protected", function() {
    // it("Should reject requests with no credentials", function() {
    //   return chai
    //     .request(app)
    //     .get("/api/protected")
    //     .then(() => expect.fail(null, null, "Request should not succeed"))
    //     .catch(err => {
    //       if (err instanceof chai.AssertionError) {
    //         throw err;
    //       }

    //       const res = err.response;
    //       expect(res).to.have.status(401);
    //     });
    // });

    // it("Should reject requests with an invalid token", function() {
    //   const token = jwt.sign(
    //     {
    //       username,
    //       email
    //     },
    //     "wrongSecret",
    //     {
    //       algorithm: "HS256",
    //       expiresIn: "7d"
    //     }
    //   );

    //   return chai
    //     .request(app)
    //     .get("/api/protected")
    //     .set("Authorization", `Bearer ${token}`)
    //     .then(() => expect.fail(null, null, "Request should not succeed"))
    //     .catch(err => {
    //       if (err instanceof chai.AssertionError) {
    //         throw err;
    //       }

    //       const res = err.response;
    //       expect(res).to.have.status(401);
    //     });
    // });

    // it("Should reject requests with an expired token", function() {
    //   const token = jwt.sign(
    //     {
    //       user: {
    //         username,
    //         email
    //       },
    //       exp: Math.floor(Date.now() / 1000) - 10
    //     },
    //     JWT_SECRET,
    //     {
    //       algorithm: "HS256",
    //       subject: username
    //     }
    //   );

    //   return chai
    //     .request(app)
    //     .get("/api/protected")
    //     .set("Authorization", `Bearer ${token}`)
    //     .then(() => expect.fail(null, null, "Request should not succeed"))
    //     .catch(err => {
    //       if (err instanceof chai.AssertionError) {
    //         throw err;
    //       }

    //       const res = err.response;
    //       expect(res).to.have.status(401);
    //     });
    // });

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
});
