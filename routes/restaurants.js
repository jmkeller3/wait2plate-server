const express = require("express");
const router = express.Router();
const { yelpAPI } = require("./yelp");

// End Points
router.get("/", async (req, res) => {
  try {
    const { latitude, longitude, location } = req.query;
    const restaurants = await yelpAPI(latitude, longitude, location);
    res.send(restaurants);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
});

module.exports = router;
