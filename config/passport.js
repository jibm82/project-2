var LocalStrategy = require("passport-local").Strategy;
var db = require("../models");

// expose this function to our app using module.exports
module.exports = function(passport) {
  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    db.User.findById(id)
      .then(function(user) {
        done(null, user);
      })
      .catch(function(err) {
        done(err);
      });
  });

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, email, password, done) {
        db.User.findOne({ where: { email: email } })
          .then(function(user) {
            if (user) {
              return done(
                null,
                false,
                req.flash("signupMessage", "That email is already taken.")
              );
            } else {
              // if there is no user with that email
              // create the user
              var newUser = db.User.build({
                name: req.body.name,
                email: email,
                password: db.User.generateHash(password),
                phone: req.body.phone
              });

              // save the user
              newUser
                .save()
                .then(function() {
                  // my nice callback stuff
                  return done(null, newUser);
                })
                .catch(function(err) {
                  return done(err);
                });
            }
          })
          .catch(function(err) {
            return done(err);
          });
      }
    )
  );

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, email, password, done) {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        db.User.findOne({ where: { email: email } })
          .then(function(user) {
            // if no user is found, return the message
            if (!user) {
              console.log("No user found");
              return done(
                null,
                false,
                req.flash("loginMessage", "No user found.")
              );
            }

            // if the user is found but the password is wrong
            if (!user.validPassword(password)) {
              console.log("Wrong password");
              return done(
                null,
                false,
                req.flash("loginMessage", "Oops! Wrong password.")
              );
            }

            // all is well, return successful user
            return done(null, user);
          })
          .catch(function(err) {
            return done(err);
          });
      }
    )
  );
};
