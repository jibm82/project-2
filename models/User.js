module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define(
    "User",
    {
      name: { type: DataTypes.STRING, validate: { len: [1] } },
      email: { type: DataTypes.STRING, validate: { isEmail: true } },
      password: { type: DataTypes.STRING, validate: { len: [1] } },
      phone: { type: DataTypes.STRING, validate: { len: [10, 10] } }
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
  };

  return User;
};
