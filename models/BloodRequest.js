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

  return BloodRequest;
};
