const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
  },
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report"
    }
  ]
});

UserSchema.methods.serialize = function() {
  return {
    username: this.username || "",
    email: this.email || "",
    points: this.points || ""
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model("User", UserSchema);
