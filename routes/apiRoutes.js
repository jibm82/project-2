var db = require("../models");

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

  // Get all bloodtypes
  app.get("/api/bloodtypes", function(req, res) {
    db.BloodType.findAll({}).then(function(dbBloodmap) {
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

  app.post(
    "/api/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/api/examples", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  app.post(
    "/api/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/api/examples", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );
};
