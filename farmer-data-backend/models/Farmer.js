'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Farmer extends Model {}
  Farmer.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      ceoId: { type: DataTypes.INTEGER, allowNull: false },
      age: { type: DataTypes.INTEGER, allowNull: false },
      sex: { type: DataTypes.ENUM('Male', 'Female', 'Other'), allowNull: false },
      fatherName: { type: DataTypes.STRING, allowNull: false },
      contact: { type: DataTypes.STRING, allowNull: false },
      aadhar: { type: DataTypes.STRING, allowNull: false },
      income: { type: DataTypes.INTEGER, allowNull: false },
      landType: { type: DataTypes.ENUM('Own', 'Rented'), allowNull: false },
      crops: { type: DataTypes.JSONB, allowNull: false },
      location: { type: DataTypes.JSONB, allowNull: false },
      locationCoords: { type: DataTypes.JSONB, defaultValue: { lat: 0, long: 0 } },
      farmerPicture: { type: DataTypes.STRING, allowNull: false },
      familyMembers: { type: DataTypes.JSONB, allowNull: true },
      farmerId: { type: DataTypes.STRING, allowNull: true },
      lastEditedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { sequelize, modelName: 'Farmer', tableName: 'Farmers' }
  );
  Farmer.associate = (models) => {
    Farmer.hasOne(models.Membership, { foreignKey: 'farmerId', as: 'membership' });
  };
  return Farmer;
};