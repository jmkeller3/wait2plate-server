const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../auth");
const JWT = require("jsonwebtoken");
const config = require("../../config");

// User Model
const User = require("../../models/User");

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
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (error) {
    console.log(error.message);
  }
});

// POST api/users
// ~Addnew user~
// ~Access Public
router.post("/", async (req, res) => {
  const { username, email, password, cpassword } = req.body;
  //   Check if username is taken

  // Check if password and cpassword match

  const user = new User({
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
      }
    });
  });
});

// PUT api/users
// ~Update a user~
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body);
    res.sendStatus(200);
  } catch (error) {
    console.log(error.message);
  }
});

// DELETE api/users
// ~Delete a user~
// ~Access Public
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    res.sendStatus(204);
  } catch (error) {
    res.status(404);
    res.json({ success: false });
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
  }
});

module.exports = router;
