module.exports = function(sequelize, DataTypes) {
  var BloodType = sequelize.define("BloodType", {
    name: {
      type: DataTypes.STRING,
      unique: true
    }
  });

  BloodType.associate = function(models) {
    BloodType.hasMany(models.DonorProfile);
  };

  return BloodType;
};
