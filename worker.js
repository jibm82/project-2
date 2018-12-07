require("dotenv").config();
var kue = require("kue");
var url = require("url");
var redis = require("redis");
var mailer = require("./tools/mailer");

// make sure we use the Heroku Redis To Go URL
// (put REDISTOGO_URL=redis://localhost:6379 in .env for local testing)

kue.redis.createClient = function() {
  var redisUrl = url.parse(process.env.REDISTOGO_URL),
    client = redis.createClient(redisUrl.port, redisUrl.hostname);
  if (redisUrl.auth) {
    client.auth(redisUrl.auth.split(":")[1]);
  }
  return client;
};

console.log(process.env.REDISTOGO_URL);

var jobs = kue.createQueue();

// see https://github.com/learnBoost/kue/ for how to do more than one job at a time
jobs.process("sendNotification", function(job, done) {
  console.log("Sending email to " + job.data.email);
  mailer.sampleEmail(job.data.email).catch(function(err) {
    console.log(err);
  });
  done();
});
