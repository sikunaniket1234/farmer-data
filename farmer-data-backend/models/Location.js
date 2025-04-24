'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {}
  Location.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      state: { type: DataTypes.STRING, allowNull: false },
      locationData: { type: DataTypes.JSONB, allowNull: false },
    },
    { sequelize, modelName: 'Location', tableName: 'Locations' }
  );
  return Location;
};