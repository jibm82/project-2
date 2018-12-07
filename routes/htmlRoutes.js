var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.User.findAll({}).then(function(dbbloodmap) {
      res.render("index", {
        user: req.user,
        examples: [
          {
            id: 001,
            text: "Valeria"
          },
          {
            id: 002,
            text: "Jorge"
          },
          {
            id: 003,
            text: "Pablo"
          },
          {
            id: 004,
            text: "Eduardo"
          }
        ]
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
