require("dotenv").config();
var kue = require("kue");
var mailer = require("./tools/mailer");
var db = require("./models");

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
  console.log("Sending email to user" + job.data.userId);
  db.BloodRequest.findById(job.data.bloodRequestId).then(function(
    bloodRequest
  ) {
    if (bloodRequest) {
      db.User.findById(job.data.userId).then(function(user) {
        mailer.newRequest(bloodRequest, user).catch(function(err) {
          console.log(err);
        });
        done();
      });
    }
  });
});
