var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.User.count().then(function(usersCount) {
      res.render("index", {
        user: req.user,
        usersCount: usersCount
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

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404", { layout: "minimal" });
  });
};
