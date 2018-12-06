var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.User.findAll({}).then(function(dbbloodmap) {
      console.log("___________dbbloodmap____________");
      console.log(dbbloodmap.length);
      console.log("___________dbbloodmap____________");
      res.render("index", {
        msg: "Welcome!",
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

  // Load example page and pass in an example by id
  app.get("/bloodtype/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(
      dbbloodmap
    ) {
      res.render("bloodtype", {
        example: dbbloodmap
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
