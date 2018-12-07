var kue = require("kue");
var redis = require("redis");

kue.redis.createClient = function() {
  var redisUrl = url.parse(process.env.REDISTOGO_URL);
  var client = redis.createClient(redisUrl.port, redisUrl.hostname);

  if (redisUrl.auth) {
    client.auth(redisUrl.auth.split(":")[1]);
  }

  return client;
};

var jobs = kue.createQueue();

jobs.on("error", function(err) {
  console.log(err);
});

module.exports = jobs;
