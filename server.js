const express = require("express");
const mongoose = require("mongoose");
const { MONGODB_URI, PORT } = require("./config");
const bodyParser = require("body-parser");

const users = require("./routes/users");
const reports = require("./routes/reports");
const restaurants = require("./routes/restaurants");

const app = express();

// Bodyparser Middleware

app.use(bodyParser.json());

// Use Routes
app.use("/api/users", users);
app.use("/api/reports", reports);
app.use("/api/restaurants", restaurants);

let server;

function runServer(databaseUri, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUri,
      { useNewUrlParser: true },
      error => {
        if (error) {
          return reject(error);
        }
        server = app
          .listen(port, () => {
            console.log(`Listening on port ${port}`);
            resolve();
          })
          .on("error", error => {
            mongoose.disconnect();
            reject(error);
          });
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing ...");
      server.close(error => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(MONGODB_URI).catch(error => console.error(error));
}

module.exports = { app, runServer, closeServer };
