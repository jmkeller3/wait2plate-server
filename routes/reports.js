const express = require("express");
const router = express.Router();
const passport = require("passport");
const bodyParser = require("body-parser");

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
    const reports = await Report.find().populate("User");
    res.status(200).json(
      reports.map(report => {
        return {
          id: report._id,
          user_id: report.user._id,
          restaurant_id: report.restaurant_id,
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
  const requiredFields = ["restaurant_id", "time", "user_id"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.log(message);
      return res.status(400).send(message);
    }
  }

  try {
    const user = await User.findById(req.body.user_id);
    if (user) {
      try {
        const { restaurant_id, time, user_id } = req.body;
        const newReport = await Report.create({
          restaurant_id,
          time,
          user_id
        });

        user.reports.push(newReport);
        user.save();
        res.status(201).json({
          id: newReport._id,
          restaurant: newReport.restaurant_id,
          user: newReport.user_id,
          time: newReport.time
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
router.put("/:id", async (req, res) => {
  try {
    const report = await Report.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    );
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    console.log(error.message);
  }
});

// DELETE api/reports
// ~Delete a report~
// ~Access Public
router.delete("/:id", async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({ _id: req.params.id });
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(404);
    res.json({ success: false });
  }
});

module.exports = router;
