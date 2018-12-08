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

  DonorProfile.getAround = function(latitude, longitude, BloodTypeId) {
    var distance = 20000;
    var lat = parseFloat(latitude);
    var lng = parseFloat(longitude);
    var attributes = Object.keys(DonorProfile.attributes);
    var location = sequelize.literal(
      "ST_GeomFromText('POINT(" + lng + " " + lat + ")')"
    );
    var distance = sequelize.fn(
      "ST_Distance_Sphere",
      sequelize.literal("location"),
      location
    );
    attributes.push([distance, "distance"]);
    return DonorProfile.findAll({
      attributes: attributes,
      // order: ['distance'],
      where: sequelize.and(sequelize.where(distance, { $lte: distance }), {
        BloodTypeId: BloodTypeId
      }),
      logging: console.log
    });
  };

  return DonorProfile;
};
