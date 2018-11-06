const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

// Create Schema
const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
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
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "report" }]
});

UserSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    points: this.points,
    reports: this.reports
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model("User", UserSchema);

module.exports = { User };
