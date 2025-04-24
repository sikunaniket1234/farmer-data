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
      ceoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      locationState: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      locationDistrict: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      locationBlock: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      locationPanchayat: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      locationVillage: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      farmerName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fatherName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sex: {
        type: Sequelize.ENUM('M', 'F'),
        allowNull: false,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      familyBoys: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      familyGirls: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      landType: {
        type: Sequelize.ENUM('Own', 'Rented'),
        allowNull: false,
      },
      income: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      aadhar: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      farmerId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      crops: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      memberFee: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      locationLat: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      locationLong: {
        type: Sequelize.DOUBLE,
        allowNull: false,
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