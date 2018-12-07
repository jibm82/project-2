var LocalStrategy = require("passport-local").Strategy;
var db = require("../models");

function buildDonor(req) {
  var location = {
    type: "Point",
    coordinates: [req.body.longitude, req.body.latitude]
  };

  return db.User.build(
    {
      name: req.body.name,
      email: req.body.email,
      password: db.User.generateHash(req.body.password),
      phone: req.body.phone,
      DonorProfile: {
        address: req.body.address,
        BloodTypeId: req.body.BloodTypeId,
        location: location
      }
    },
    {
      include: [db.DonorProfile]
    }
  );
}

function buildRequester(req) {
  // TODO include request info
  return db.User.build({
    name: req.body.name,
    email: req.body.email,
    password: db.User.generateHash(req.body.password),
    phone: req.body.phone
  });
}

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
              return done(null, false, {
                result: false,
                errors: [
                  {
                    param: "email",
                    msg: "Email is already taken"
                  }
                ]
              });
            } else {
              // if there is no user with that email
              // create the user
              var newUser = undefined;

              if (req.body.donor) {
                newUser = buildDonor(req);
              } else {
                newUser = buildRequester(req);
              }

              // save the user
              newUser
                .save()
                .then(function() {
                  return done(null, newUser);
                })
                .catch(function(err) {
                  console.log(err);
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
              return done(null, false, {
                result: false,
                errors: [
                  {
                    param: "email",
                    msg: "Email is not registered"
                  }
                ]
              });
            }

            // if the user is found but the password is wrong
            if (!user.validPassword(password)) {
              return done(null, false, {
                result: false,
                errors: [
                  {
                    param: "password",
                    msg: "Your password is incorrect"
                  }
                ]
              });
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
