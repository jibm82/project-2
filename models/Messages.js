module.exports = function(sequelize, DataTypes) {
  var Messages = sequelize.define("Messages", {
    body: DataTypes.STRING,
    date: DataTypes.DATE,
    href: DataTypes.STRING
  });

  Messages.associate = function(models) {
    Messages.belongsTo(models.User);
  };
  return Messages;
};
