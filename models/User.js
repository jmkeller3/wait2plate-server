const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Report = require("./Report");

mongoose.Promise = global.Promise;

// Create Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true
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
    username: this.username,
    email: this.email,
    points: this.points,
    reports: this.reports
  };
};

UserSchema.pre("findOne", function(next) {
  this.populate("reports");
  next();
});

UserSchema.pre("find", function(next) {
  this.populate("reports");
  next();
});

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
