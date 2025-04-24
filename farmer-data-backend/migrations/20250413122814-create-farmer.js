'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Farmers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fatherName: {
        type: Sequelize.STRING,
      },
      sex: {
        type: Sequelize.STRING,
      },
      age: {
        type: Sequelize.INTEGER,
      },
      familyMembers: {
        type: Sequelize.JSONB,
      },
      landType: {
        type: Sequelize.STRING,
      },
      income: {
        type: Sequelize.INTEGER,
      },
      aadhar: {
        type: Sequelize.STRING,
      },
      farmerId: {
        type: Sequelize.STRING,
      },
      crops: {
        type: Sequelize.JSONB,
      },
      memberFee: {
        type: Sequelize.INTEGER,
      },
      contact: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      locationCoords: {
        type: Sequelize.JSONB,
      },
      photo: {
        type: Sequelize.STRING,
      },
      ceoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Farmers');
  },
};