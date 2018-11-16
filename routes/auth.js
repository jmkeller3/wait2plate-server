const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const JWT = require("jsonwebtoken");

const config = require("../config");
const router = express.Router();

const createAuthToken = function(user) {
  return JWT.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: "7d",
    algorithm: "HS256"
  });
};

const localAuth = passport.authenticate("local", { session: false });

router.use(bodyParser.json());

router.post("/login", localAuth, async (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.json({
    authToken
  });
});

module.exports = { router, createAuthToken };
