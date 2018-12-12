const mongoose = require("mongoose");

// const User = require("./User");

// Create Schema
const ReportSchema = new mongoose.Schema({
  restaurant_id: {
    type: String,
    required: true
  },
  restaurant_name: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// ReportSchema.virtual("user_id").get(() => {
//   `${this.user.id}`;
// });

ReportSchema.methods.serialize = function() {
  return {
    id: this._id,
    restaurant_id: this.restaurant_id,
    restaurant_name: this.restaurant_name,
    time: this.time,
    user_id: this.user_id,
    date: this.date
  };
};

ReportSchema.pre("findOne", function(next) {
  this.populate("user");
  next();
});

ReportSchema.pre("find", function(next) {
  this.populate("user");
  next();
});

ReportSchema.pre("remove", function(next) {
  // Remove the reference is the user who reported
  this.model("User").remove({ report: this._id }, next);
});

const Report = mongoose.model("Report", ReportSchema);
module.exports = Report;
