module.exports = function(sequelize, DataTypes) {
  var BloodRequest = sequelize.define("BloodRequest", {
    patientName: DataTypes.STRING,
    address: DataTypes.STRING,
    donationType: DataTypes.STRING,
    location: {
      type: DataTypes.GEOMETRY("POINT", 4326)
    }
  });

  BloodRequest.associate = function(models) {
    BloodRequest.belongsTo(models.User);
    BloodRequest.belongsTo(models.BloodType);
  };

  BloodRequest.getAround = function(latitude, longitude, BloodTypeId) {
    var distance = 20000;
    var lat = parseFloat(latitude);
    var lng = parseFloat(longitude);
    var attributes = Object.keys(BloodRequest.attributes);
    var location = sequelize.literal(
      "ST_GeomFromText('POINT(" + lng + " " + lat + ")')"
    );
    var distance = sequelize.fn(
      "ST_Distance_Sphere",
      sequelize.literal("location"),
      location
    );
    attributes.push([distance, "distance"]);
    return BloodRequest.findAll({
      attributes: attributes,
      // order: ['distance'],
      where: sequelize.and(sequelize.where(distance, { $lte: distance }), {
        BloodTypeId: BloodTypeId
      }),
      include: [{ all: true }]
    });
  };

  return BloodRequest;
};
