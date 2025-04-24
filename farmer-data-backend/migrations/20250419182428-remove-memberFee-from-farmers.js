module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('Farmers', 'memberFee');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Farmers', 'memberFee', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};