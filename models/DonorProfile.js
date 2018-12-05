module.exports = function(sequelize, DataTypes) {
  var DonorProfile = sequelize.define("DonorProfile", {
    address: DataTypes.STRING,
    privShowName: DataTypes.BOOLEAN,
    privShowPhone: DataTypes.BOOLEAN,
    privShowAddress: DataTypes.BOOLEAN,
    location: {
      type: DataTypes.GEOMETRY("POINT", 4326)
    }
  });

  DonorProfile.associate = function(models) {
    DonorProfile.belongsTo(models.User);
    DonorProfile.belongsTo(models.BloodType);
  };

  return DonorProfile;
};
