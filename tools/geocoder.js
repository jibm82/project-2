var googleMapsClient = require("@google/maps").createClient({
  key: process.env.GOOGLE_MAPS_APIKEY
});

var geocoder = {
  geocode: function(address, callback) {
    console.log(address);
    googleMapsClient.geocode(
      {
        address: address
      },
      function(err, response) {
        console.log(response);
        if (!err) {
          console.log(response.json.results);
          callback(response.json.results);
        } else {
          console.log(err);
          callback(null);
        }
      }
    );
  }
};

module.exports = geocoder;
