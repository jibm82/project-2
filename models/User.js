var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1] }
      },
      email: { type: DataTypes.STRING, validate: { isEmail: true } },
      password: { type: DataTypes.STRING, validate: { len: [1] } },
      phone: { type: DataTypes.STRING }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["email"]
        }
      ]
    }
  );

  User.associate = function(models) {
    User.hasOne(models.DonorProfile, { onDelete: "cascade" });
    User.hasMany(models.BloodRequest, { onDelete: "cascade" });
  };

  User.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  // checking if password is valid
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};
