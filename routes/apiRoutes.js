var db = require("../models");
var jobs = require("../tools/jobs");
var geocoder = require("../tools/geocoder");
var signupValidation = require("../validations/signupValidation");

function sendRequestNotifications(bloodRequestId) {
  db.BloodRequest.findById(bloodRequestId).then(function(BloodRequest) {
    var long = BloodRequest.location.coordinates[0];
    var lat = BloodRequest.location.coordinates[1];
    db.DonorProfile.getAround(lat, long, BloodRequest.BloodTypeId).then(
      function(donorProfiles) {
        donorProfiles.forEach(function(donorProfile, index) {
          jobs
            .create("sendNotification", {
              userId: donorProfile.UserId,
              bloodRequestId: BloodRequest.id
            })
            .delay(1000 * index)
            .events(false)
            .save();
        });
      }
    );
  });
}

module.exports = function(app, passport) {
  // Get all bloodtypes
  app.get("/api/bloodtypes", function(req, res) {
    db.BloodType.findAll({}).then(function(dbBloodmap) {
      res.json(dbBloodmap);
    });
  });

  app.post("/api/login", function(req, res, next) {
    passport.authenticate("local-login", function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.json(info);
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.json({ result: true });
      });
    })(req, res, next);
  });

  app.post("/api/signup", function(req, res, next) {
    if (signupValidation(req, res)) {
      passport.authenticate("local-signup", function(err, user, info) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.json(info);
        }
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
          if (req.body.donor === null) {
            sendRequestNotifications(user.BloodRequests[0].id);
          }
          return res.json({ result: true });
        });
      })(req, res, next);
    }
  });

  app.post("/api/geocode/", function(req, res) {
    geocoder.geocode(req.body.address, function(results) {
      res.json(results);
    });
  });
};
