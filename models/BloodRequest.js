module.exports = function(sequelize, DataTypes) {
  var BloodRequest = sequelize.define("BloodRequest", {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    donationType: DataTypes.STRING
  });

  BloodRequest.associate = function(models) {
    BloodRequest.belongsTo(models.User);
    BloodRequest.belongsTo(models.BloodType);
  };

  return BloodRequest;
};
