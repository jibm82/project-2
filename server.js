require("dotenv").config();
var PORT = process.env.PORT || 3000;

var cookieParser = require("cookie-parser");
var db = require("./models");
var exphbs = require("express-handlebars");
var express = require("express");
var expressValidator = require("express-validator");
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("passport");

var app = express();

// Configure passport
require("./config/passport")(passport);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static("public"));

// required for passport
app.use(session({ secret: "bloodmap" })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app, passport);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
