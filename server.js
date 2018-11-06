const express = require("express");
const mongoose = require("mongoose");
const { PORT, MONGODB_URI, TEST_URI } = require("./config");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const morgan = require("morgan");

mongoose.Promise = global.Promise;

// Defining routers
const { router: usersRouter } = require("./users/router");
const { router: reportsRouter } = require("./reports/router");
const { router: authRouter, localStrategy, jwtStrategy } = require("./auth");

const app = express();

// Middleware

app.use(bodyParser.json());
app.use(morgan("common"));
app.use(cors());

// Passport JWT
passport.use(localStrategy);
passport.use(jwtStrategy);

// Use Routes
app.use("/api/users", usersRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/auth", authRouter);

const jwtAuth = passport.authenticate("JWT", { session: false });

// TEST protected endpoint
app.get("/api/protected", jwtAuth, (req, res) => {
  return res.json({
    data: "Hello There"
  });
});

app.use(express.json());
app.use(express.static("public"));

// app.listen(PORT, () => {
//   mongoose.set("useFindAndModify", false);
//   mongoose.connect(
//     MONGODB_URI,
//     { useNewUrlParser: true }
//   );
//   console.log(`Server started on port ${PORT}`);
// });

// DB Config
const db = mongoose.connection;

db.on("error", error => console.log(error));

let server;

function runServer(DATABASE_URI, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      DATABASE_URI,
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
  return new Promise((resolve, reject) => {
    console.log("Closing . . .");
    server.close(error => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer(MONGODB_URI).catch(error => console.error(error));
}
