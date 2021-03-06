const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const faker = require("faker");
const { createAuthToken } = require("../routes/auth");
const jwt = require("jsonwebtoken");

const { app, closeServer, runServer } = require("../server");

const { JWT_SECRET, TEST_DATABASE_URI } = require("../config");

const should = chai.should();
chai.use(chaiHttp);

let authToken;
function seedReportData() {
  console.info(`Seeding Report Data...`);
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push(generateReportData());
  }

  return Report.insertMany(seedData);
}

function generateReportData(id) {
  return {
    id: Math.floor(Math.random * 1000),
    restaurant_id: Math.floor(Math.random * 10),
    time: Math.floor(Math.random * 5000),
    user: id
  };
}

function seedUserData() {
  console.info(`Seeding User Data..`);
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push(generateUserData());
  }
}

function generateUserData() {
  const user = {
    id: Math.floor(Math.random * 100),
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    reports: [
      generateReportData(id),
      generateReportData(id),
      generateReportData(id),
      generateReportData(id),
      generateReportData(id)
    ]
  };
  authToken = createAuthToken(user);
  return authToken;
}

function tearDownDb() {
  console.warn(`Deleting database`);
  return mongoose.connection.dropDatabase();
}

describe("API", function() {
  const username = "exampleUser";
  const email = "exampleEmail";
  const password = "examplePassword";

  before(function() {
    return runServer(TEST_DATABASE_URI);
  });

  after(function() {
    return closeServer();
  });

  describe("GET endpoint", function() {
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
        .get("/api/reports")
        .set("authorization", `Bearer ${token}`)
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
        });
    });
  });
});
