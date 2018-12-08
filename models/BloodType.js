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

  BloodType.getAround = function (latitude, longitude, bloodtypeId) {
    var distance = 20000;
    var lat = parseFloat(latitude);
    var lng = parseFloat(longitude);
    var attributes = Object.keys(BloodType.attributes);
    var location = sequelize.literal("ST_GeomFromText('POINT("+lng+" "+lat+")')");
    var distance = sequelize.fn('ST_Distance_Sphere', sequelize.literal('location'), location);
    attributes.push([distance, 'distance']);
    return BloodType.findAll({
      attributes: attributes,
      // order: ['distance'],
      where: sequelize.and(sequelize.where(distance, {$lte: distance}),{}),
      logging: console.log
    })
  };

  return BloodType;
};
