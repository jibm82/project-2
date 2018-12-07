var kue = require("kue");

var jobs = kue.createQueue({
  redis: process.env.REDISTOGO_URL
});

jobs.on("error", function(err) {
  console.log(err);
});

module.exports = jobs;
