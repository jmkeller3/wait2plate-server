const express = require("express");
const router = express.Router();
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();

// Report Model
const Report = require("../models/Report");
const User = require("../models/User");

const jwtAuth = passport.authenticate("jwt", { session: false });

// GET api/reports
// ~Get all reports~
// ~Access Public

router.get("/", jwtAuth, async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(
      reports.map(report => {
        return {
          id: report._id,
          user_id: report.user._id,
          restaurant_id: report.restaurant_id,
          restaurant_name: report.restaurant_name,
          time: report.time,
          date: report.date
        };
      })
    );
  } catch (error) {
    res.sendStatus(500);
    console.log(error.message);
  }
});

// GET api/reports
// ~Get a single report~
// Access Public
router.get("/:id", jwtAuth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate("User");
    res.status(200).json(report.serialize());
  } catch (error) {
    res.sendStatus(500);
    console.log(error.message);
  }
});

// POST api/reports
// ~Add new report~
// ~Access Public
router.post("/", jsonParser, jwtAuth, async (req, res) => {
  const requiredFields = ["restaurant_id", "restaurant_name", "time"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.log(message);
      return res.status(400).send(message);
    }
  }

  try {
    const user = await User.findById(req.user.id);
    if (user) {
      try {
        const { restaurant_id, restaurant_name, time } = req.body;
        const newReport = await Report({
          _id: new mongoose.Types.ObjectId(),
          restaurant_id,
          restaurant_name,
          time,
          user: user._id
        });

        newReport.save();
        user.reports.push(newReport._id);
        user.points += 1;
        user.save();
        res.status(201).json({
          id: newReport.id,
          restaurant_id: newReport.restaurant_id,
          restaurant_name: newReport.restaurant_name,
          time: newReport.time,
          user: user._id,
          points: user.points
        });
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error!" });
      }
    } else {
      const message = `User not found! Please login or sign-up.`;
      console.log(message);
      return res.status(400).send(message);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT api/reports
// ~Update a user~
router.put("/:id", jwtAuth, async (req, res) => {
  try {
    const report = await Report.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    );
    res.status(202).json(report.serialize());
  } catch (error) {
    res.sendStatus(500);
    console.log(error.message);
  }
});

// DELETE api/reports
// ~Delete a report~
// ~Access Public
router.delete("/:id", jwtAuth, async (req, res) => {
  const deleteReport = req.params.id;
  const user = await User.findById(req.user.id);

  if (user) {
    try {
      try {
        await Report.findOneAndRemove({ _id: deleteReport });
        const reportIndex = user.reports.indexOf(deleteReport);
        if (reportIndex !== -1) {
          user.reports.splice(reportIndex, 1);
        }
        user.save();
        res.sendStatus(204);
      } catch (error) {
        console.error(error);
        res.sendStatus(404);
      }
    } catch (err) {
      console.log(err);
    }
  }
});

module.exports = router;
