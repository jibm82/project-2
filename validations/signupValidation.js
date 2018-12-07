var errors = null;

var signupValidation = function(req, res) {
  basicValidation(req);

  errors = req.validationErrors();

  if (errors) {
    res.json({ result: false, errors: errors });
    return false;
  } else {
    return true;
  }
};

function basicValidation(req) {
  req.checkBody("name", "Name is required").notEmpty();
  req.checkBody("email", "Email must be a valid email address").isEmail();
  req.checkBody("password", "Password is required").notEmpty();
  req.checkBody("latitude", "Latitude is required").notEmpty();
  req.checkBody("longitude", "Longitude is required").notEmpty();
}

module.exports = signupValidation;
