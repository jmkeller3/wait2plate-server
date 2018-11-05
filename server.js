const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const bodyParser = require("body-parser");

const users = require("./routes/api/users");
const reports = require("./routes/api/reports");

const app = express();

// Bodyparser Middleware

app.use(bodyParser.json());

// Use Routes
app.use("/api/users", users);
app.use("/api/reports", reports);

app.listen(config.PORT, () => {
  mongoose.set("useFindAndModify", false);
  mongoose.connect(
    config.MONGODB_URI,
    { useNewUrlParser: true }
  );
  console.log(`Server started on port ${config.PORT}`);
});

// DB Config
const db = mongoose.connection;

db.on("error", error => console.log(error));
