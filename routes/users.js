const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("./auth");
const JWT = require("jsonwebtoken");
const config = require("../config");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// User Model
const User = require("../models/User");

const jwtAuth = passport.authenticate("jwt", { session: false });
const jsonParser = bodyParser.json();

// GET api/users
// ~Get all users~
// ~Access Public

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.log(error);
  }
});

// GET api/users
// ~Get a single user~
// Access Public
router.get("/:id", jwtAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.populate("Report");
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
  }
});

// POST api/users
// ~Addnew user~
// ~Access Public
router.post("/", jsonParser, async (req, res) => {
  // Check if missing fields
  const requiredFields = ["email", "password", "cpassword", "username"];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Missing field",
      location: missingField
    });
  }

  // Check for non-strings in fields
  const stringFields = ["username", "email", "password", "cpassword"];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== "string"
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Incorrect field type: expected string",
      location: nonStringField
    });
  }

  // Check size of fields
  const sizedFields = {
    username: {
      min: 2
    },
    password: {
      min: 10,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      "min" in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      "max" in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  const { username, email, password, cpassword } = req.body;

  // Check if password and cpassword match

  if (password !== cpassword) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: `Your password and confirmation did not match. Please try again`,
      location: "cpassword"
    });
  }

  const user = await new User({
    username,
    email,
    password,
    cpassword
  });

  //   protect password
  bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(user.password, salt, async (error, hash) => {
      user.password = hash;
      //   save user to db
      try {
        const newUser = await user.save();
        res.sendStatus(201);
      } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
      }
    });
  });
});

// DELETE api/users
// ~Delete a user~
// ~Access Public
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    res.sendStatus(204);
  } catch (error) {
    res.status(404).json({ success: false });
  }
});

// Auth User
router.post("/auth", async (req, res) => {
  const { username, password } = req.body;

  // Create JWT
  const token = JWT.sign(user.toJSON(), config.JWT_SECRET, { expiresIn: "7d" });

  const { iat, exp } = JWT.decode(token);
  // Respond with token
  res.send({ iat, exp, token });

  try {
    // Authenticate User
    const user = await auth.authenicate(username, password);
  } catch (error) {
    // User unauthorized
    console.log(error.message);
    res.sendStatus(403);
  }
});

module.exports = router;
