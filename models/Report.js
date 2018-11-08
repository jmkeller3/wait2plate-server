const mongoose = require("mongoose");

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

const Report = mongoose.model("Report", ReportSchema);
module.exports = Report;
