const express = require("express");
const router = express.Router();

// Report Model
const Report = require("../models/Report");

// GET api/reports
// ~Get all reports~
// ~Access Public

router.get("/", async (req, res) => {
  try {
    const reports = await Report.find().sort({ date: -1 });
    res.json(reports);
  } catch (error) {
    res.sendStatus(500);
    console.log(error.message);
  }
});

// GET api/reports
// ~Get a single report~
// Access Public
router.get("/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    res.sendStatus(report);
  } catch (error) {
    res.sendStatus(500);
    console.log(error.message);
  }
});

// POST api/reports
// ~Add new report~
// ~Access Public
router.post("/", async (req, res) => {
  try {
    const { restaurant_id, time, user_id } = req.body;

    const report = new Report({
      restaurant_id,
      time,
      user_id
    });

    const newReport = await report.save();
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
    console.log(error.message);
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
