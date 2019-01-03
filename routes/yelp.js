const yelp = require("yelp-fusion");
const client = yelp.client(
  "wtDdoHLiHoZqDEU0ZWo3uHBi0IBen5wzmGerYvdp58lnSjfq_h-dq9TccWT49zatcNX6caOlqRWMFQS0SMQEuUnjhp_wKydOnWaREotovaXyIgEzDJs_PQr6IC3iW3Yx"
);

// const latitude = 40.4173276;
// const longitude = -111.87851189999999;

async function yelpAPI(latitude, longitude, location) {
  if (!location) {
    try {
      const data = await client.search({
        latitude,
        longitude,

        open_now: true,
        sort_by: "distance"
      });

      const businesses = JSON.parse(data.body).businesses;
      const prettyData = businesses.map(business => {
        let result = {
          id: business.id,
          name: business.name,
          url: business.url,
          image_url: business.image_url,
          display_address: business.location.display_address,
          display_phone: business.display_phone,
          rating: business.rating,
          distance: business.distance
        };
        return result;
      });
      return prettyData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  } else {
    try {
      const data = await client.search({
        location,
        open_now: true,
        sort_by: "distance"
      });

      const businesses = JSON.parse(data.body).businesses;
      const prettyData = businesses.map(business => {
        let result = {
          id: business.id,
          name: business.name,
          url: business.url,
          image_url: business.image_url,
          display_address: business.location.display_address,
          display_phone: business.display_phone,
          rating: business.rating,
          distance: business.distance
        };
        return result;
      });
      return prettyData;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = { yelpAPI };
