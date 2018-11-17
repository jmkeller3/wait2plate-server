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
    User.remove();
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
      it("Should reject users with non-string email", () => {
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

      it("Should reject users with non-trimmed username", () => {
        chai
          .request(app)
          .post("/api/users")
          .send({
            username: ` ${username} `,
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
              "Cannot start or end with whitespace"
            );
            expect(res.body.location).to.equal("username");
          });
      });
      it("Should reject users with non-trimmed password", () => {
        chai
          .request(app)
          .post("/api/users")
          .send({
            username,
            email,
            password: ` ${password} `
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
              "Cannot start or end with whitespace"
            );
            expect(res.body.location).to.equal("password");
          });
      });
      it("Should reject users with empty username", () => {
        chai
          .request(app)
          .post("/api/users")
          .send({
            username: "",
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
              "Must be at least 1 characters long"
            );
            expect(res.body.location).to.equal("username");
          });
      });

      it("Should reject users with password less than ten characters", () => {
        chai
          .request(app)
          .post("/api/users")
          .send({
            username,
            email,
            password: "123456789"
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
              "Must be at least 10 characters long"
            );
            expect(res.body.location).to.equal("password");
          });
      });

      it("Should reject users with password greater than 72 characters", () => {
        chai
          .request(app)
          .post("/api/users")
          .send({
            username,
            email,
            password: new Array(73).fill("a").join("")
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
              "Must be at most 72 characters long"
            );
            expect(res.body.location).to.equal("password");
          });
      });
      // it("Should reject users with duplicate username", () => {
      //   return User.create({
      //     username,
      //     email,
      //     password
      //   })
      //     .then(() =>
      //       chai
      //         .request(app)
      //         .post("/api/users")
      //         .send({
      //           username,
      //           email,
      //           password
      //         })
      //     )
      //     .then(() => expect.fail(null, null, "Request should not succeed"))
      //     .catch(err => {
      //       if (err instanceof chai.AssertionError) {
      //         throw err;
      //       }

      //       const res = err.response;
      //       expect(res).to.have.status(422);
      //       expect(res.body.reason).to.equal("ValidationError");
      //       expect(res.body.message).to.equal("Username already taken");
      //       expect(res.body.location).to.equal("username");
      //     });
      // });
      it("Should create a new user", () => {
        chai
          .request(app)
          .post("/api/users")
          .send({
            username,
            email,
            password
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.keys("username", "email");
            expect(res.body.username).to.equal(username);
            expect(res.body.email).to.equal(email);
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.email).to.equal(email);
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      });
    });
    describe("GET", () => {
      it("Should return an empty array initially", () => {
        chai
          .request(app)
          .get("/api/users")
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("array");
            expect(res.body).to.have.length(0);
          });
      });
      it("Should return an array of users", () => {
        User.create(
          {
            username,
            email,
            password
          },
          {
            username: usernameB,
            email: emailB,
            password: passwordB
          }
        )
          .then(() => chai.request(app).get("/api/users"))
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("array");
            expect(res.body).to.have.length(2);
            expect(res.body[0]).to.deep.equal({
              username,
              email
            });
            expect(res.body[1]).to.deep.equal({
              username: usernameB,
              email: emailB
            });
          });
      });
    });
  });
});
