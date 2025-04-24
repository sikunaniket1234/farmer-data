module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Step 1: Add farmerPicture column (temporary, nullable)
      await queryInterface.addColumn(
        'Farmers',
        'farmerPicture',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction }
      );

      // Step 2: Copy data from photo to farmerPicture
      await queryInterface.sequelize.query(
        `UPDATE "Farmers" SET "farmerPicture" = COALESCE("photo", 'uploads/placeholder.jpg')`,
        { transaction }
      );

      // Step 3: Make farmerPicture not nullable
      await queryInterface.changeColumn(
        'Farmers',
        'farmerPicture',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction }
      );

      // Step 4: Remove photo column
      await queryInterface.removeColumn('Farmers', 'photo', { transaction });
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Step 1: Add photo column back (nullable)
      await queryInterface.addColumn(
        'Farmers',
        'photo',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction }
      );

      // Step 2: Copy data from farmerPicture to photo
      await queryInterface.sequelize.query(
        `UPDATE "Farmers" SET "photo" = "farmerPicture"`,
        { transaction }
      );

      // Step 3: Remove farmerPicture column
      await queryInterface.removeColumn('Farmers', 'farmerPicture', { transaction });
    });
  },
};