const express = require("express");
const passport = require("passport");
const JWT = require("jsonwebtoken");
const config = require("../config");
const router = express.Router();
const bodyParser = require("body-parser");

const createAuthToken = function(user) {
  return JWT.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: "7d",
    algorithm: "HS256"
  });
};

const localAuth = passport.authenticate("local", { session: false });

router.post("/login", bodyParser.json(), localAuth, async (req, res) => {
  try {
    const authToken = createAuthToken(req.user.serialize());
    res.json({
      authToken
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = { router, createAuthToken };
