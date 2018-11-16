const mongoose = require("mongoose");

const User = require("./User");

// Create Schema
const ReportSchema = new mongoose.Schema({
  restaurant_id: {
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

const Report = mongoose.model("Report", ReportSchema);
module.exports = Report;
