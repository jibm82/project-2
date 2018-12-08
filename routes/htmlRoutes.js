var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.DonorProfile.count().then(function(DonorProfileCount) {
      db.BloodRequest.count().then(function(BloodRequestCount) {
        res.render("index", {
          user: req.user,
          DonorProfileCount: DonorProfileCount,
          BloodRequestCount: BloodRequestCount
        });
      });
    });
  });

  app.get("/login", function(req, res) {
    if (req.user) {
      res.redirect("/profile");
    } else {
      res.render("login");
    }
  });

  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/profile");
  });

  app.get("/signup", function(req, res) {
    if (req.user) {
      res.redirect("/");
    } else {
      db.BloodType.findAll({}).then(function(dbBloodmap) {
        res.render("signup", { bloodTypes: dbBloodmap });
      });
    }
  });

  app.get("/bloodrequest", function(req, res) {
    if (req.user) {
      res.redirect("/");
    } else {
      db.BloodType.findAll({}).then(function(dbBloodmap) {
        res.render("bloodrequest", { bloodTypes: dbBloodmap });
      });
    }
  });

  app.get("/profile", function(req, res) {
    if (req.user) {
      db.User.findOne({
        where: {
          email: req.user.email
        },
        include: [{ all: true, include: [{ all: true }] }]
      }).then(function(user) {
        if (user.DonorProfile) {
          var long = user.DonorProfile.location.coordinates[0];
          var lat = user.DonorProfile.location.coordinates[1];
          db.BloodRequest.getAround(
            lat,
            long,
            user.DonorProfile.BloodTypeId
          ).then(function(bloodrequests) {
            res.render("profile", { user: user, bloodrequests: bloodrequests });
          });
        } else {
          console.log(user);
          res.render("profile", { user: user });
        }
      });
    } else {
      db.BloodType.findAll({}).then(function(dbBloodmap) {
        res.render("signup", { bloodTypes: dbBloodmap });
      });
    }
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404", { layout: "minimal" });
  });
};
