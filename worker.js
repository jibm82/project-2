require("dotenv").config();
var kue = require("kue");
var mailer = require("./tools/mailer");

// make sure we use the Heroku Redis To Go URL
// (put REDISTOGO_URL=redis://localhost:6379 in .env for local testing)

var jobs = kue.createQueue({
  redis: process.env.REDISTOGO_URL
});

jobs.on("error", function(err) {
  console.log(err);
});

// see https://github.com/learnBoost/kue/ for how to do more than one job at a time
jobs.process("sendNotification", function(job, done) {
  console.log("Sending email to " + job.data.email);
  mailer.sampleEmail(job.data.email).catch(function(err) {
    console.log(err);
  });
  done();
});
