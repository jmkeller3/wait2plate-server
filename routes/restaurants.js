const express = require("express");
const router = express.Router();
const { yelpAPI } = require("./yelp");
const Report = require("../models/Report");

// End Points
router.get("/", async (req, res) => {
  try {
    const { latitude, longitude, location } = req.query;
    const restaurants = await yelpAPI(latitude, longitude, location);

    const times = await Report.aggregate([
      {
        $group: { _id: "$restaurant_id", avgTime: { $avg: "$time" } }
      }
    ]);

    const client_restaurants = restaurants.map(restaurant => {
      let wait_time = times.find(time => time._id === restaurant.id);
      if (wait_time !== undefined) {
        console.log(wait_time);
        return {
          ...restaurant,
          reported_times: wait_time.avgTime
        };
      }
      return {
        ...restaurant,
        reported_times: `No times reported.`
      };
    });

    res.status(200).send(client_restaurants);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
});

module.exports = router;
