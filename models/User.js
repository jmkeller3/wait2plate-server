const mongoose = require("mongoose");

// Create Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  points: {
    type: String,
    default: 0
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
