var kue = require("kue");
var redis = require("redis");

kue.redis.createClient = function() {
  var redisUrl = url.parse(process.env.REDISTOGO_URL),
    client = redis.createClient(redisUrl.port, redisUrl.hostname);
  if (redisUrl.auth) {
    client.auth(redisUrl.auth.split(":")[1]);
  }
  return client;
};

var jobs = kue.createQueue();

module.exports = jobs;
