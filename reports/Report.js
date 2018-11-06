const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

// Create Schema
const ReportSchema = new Schema({
  restaurant_id: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Report = mongoose.model("Report", ReportSchema);

module.exports = { Report };
