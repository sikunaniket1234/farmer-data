'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {}
  Membership.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      farmerId: { type: DataTypes.INTEGER, allowNull: false },
      ceoId: { type: DataTypes.INTEGER, allowNull: false },
      membershipFee: { type: DataTypes.INTEGER, allowNull: false },
      receiptNo: { type: DataTypes.STRING, allowNull: false },
      receiptPicture: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, modelName: 'Membership', tableName: 'Memberships' }
  );
  Membership.associate = (models) => {
    Membership.belongsTo(models.Farmer, { foreignKey: 'farmerId', as: 'farmer' });
    Membership.belongsTo(models.User, { foreignKey: 'ceoId', as: 'ceo' }); // Added ceo association
  };
  return Membership;
};