var db = require("../models");
var jobs = require("../tools/jobs");
var geocoder = require("../tools/geocoder");
var signupValidation = require("../validations/signupValidation");

module.exports = function(app, passport) {
  // Get all bloodtypes
  app.get("/api/bloodtypes", function(req, res) {
    db.BloodType.findAll({}).then(function(dbBloodmap) {
      res.json(dbBloodmap);
    });
  });

  // Get all users
  app.get("/api/users", function(req, res) {
    db.User.findAll({}).then(function(dbBloodmap) {
      res.json(dbBloodmap);
    });
  });

  app.get("/api/donors", function(req, res) {
    db.User.findAll({
      include: [
        {
          model: db.DonorProfile,
          required: true,
          include: [
            {
              model: db.BloodType
            }
          ]
        }
      ]
    }).then(function(dbBloodmap) {
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
          return res.json({ result: true });
        });
      })(req, res, next);
    }
  });

  app.get("/api/nearbydonors/:id", function(req, res) {
    db.BloodRequest.findById(req.params.id).then(function(BloodRequest) {
      var long = BloodRequest.location.coordinates[0];
      var lat = BloodRequest.location.coordinates[1];
      db.DonorProfile.getAround(lat, long, BloodRequest.BloodTypeId).then(
        function(donors) {
          res.json(donors);
        }
      );
    });
  });

  app.post("/api/geocode/", function(req, res) {
    geocoder.geocode(req.body.address, function(results) {
      res.json(results);
    });
  });

  app.get("/api/send-notifications", function(req, res) {
    db.User.findAll({}).then(function(users) {
      users.forEach(function(user, index) {
        jobs
          .create("sendNotification", {
            email: user.email
          })
          .delay(1000 * index)
          .events(false)
          .save();
      });

      res.json({ result: true, deliveries: users.length });
    });
  });
};
