var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.bloodmap.findAll({}).then(function(dbbloodmap) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbbloodmap
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
