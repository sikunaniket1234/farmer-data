module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Memberships', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      farmerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Farmers', key: 'id' },
      },
      ceoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
      membershipFee: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      receiptNo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      receiptPicture: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Memberships');
  },
};