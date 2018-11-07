const express = require("express");
const router = express.router();

// End Points
router.get("https://api.yelp.com/v3/businesses/search", async (req, res) => {
  const { latitude, longitude, city } = req.body;
  const location = {
    latitude,
    longitude
  };
  try {
  } catch (error) {
    console.log(error.message);
  }
});
