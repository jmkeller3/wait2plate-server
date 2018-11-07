const yelp = require("yelp-fusion");
const client = yelp.client(
  "wtDdoHLiHoZqDEU0ZWo3uHBi0IBen5wzmGerYvdp58lnSjfq_h-dq9TccWT49zatcNX6caOlqRWMFQS0SMQEuUnjhp_wKydOnWaREotovaXyIgEzDJs_PQr6IC3iW3Yx"
);

const latigude = 40.4173276;
const longitude = -111.87851189999999;

// Old School
client
  .search({
    latigude,
    longitude,
    open_now: true
  })
  .then(res => {
    const firstResult = res.jsonBody.businesses[0];
    const prettyResult = JSON.stringify(firstResult, null, 4);
    console.log(prettyResult);
  })
  .catch(err => {
    console.log(err);
  });

// New School
async function yelpAPI(latigude, longitude) {
  try {
    const restaurants = await client.search({
      latigude,
      longitude,
      open_now: true
    });
    data.map(datum => {
      let result = res.jsonBody.businesses;
      console.log(JSON.stringify(result, null, 4));
    });
  } catch (error) {
    console.log(err);
  }
}
