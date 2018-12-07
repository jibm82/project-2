module.exports = function(sequelize, DataTypes) {
  var DonorProfile = sequelize.define("DonorProfile", {
    address: { type: DataTypes.STRING, allowNull: false },
    privShowName: { type: DataTypes.BOOLEAN, defaultValue: true },
    privShowPhone: { type: DataTypes.BOOLEAN, defaultValue: true },
    privShowAddress: { type: DataTypes.BOOLEAN, defaultValue: true },
    location: {
      type: DataTypes.GEOMETRY("POINT", 4326)
    }
  });

  DonorProfile.associate = function(models) {
    DonorProfile.belongsTo(models.User, { foreignKey: { allowNull: false } });
    DonorProfile.belongsTo(models.BloodType, {
      foreignKey: { allowNull: false }
    });
  };

  return DonorProfile;
};
