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
      res.redirect("/");
    } else {
      res.render("login");
    }
  });

  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
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

  app.get("/bloodrequests", function(req, res) {
    db.BloodRequest.findAll({ include: [db.BloodType, db.User] }).then(function(
      BloodRequests
    ) {
      res.render("bloodrequests", { BloodRequests: BloodRequests });
    });
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

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404", { layout: "minimal" });
  });
};
