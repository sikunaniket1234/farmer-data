'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Ensure location column has data from state, district, block, panchayat, village
    await queryInterface.sequelize.query(`
      UPDATE "Farmers"
      SET location = jsonb_build_object(
        'state', COALESCE(state, ''),
        'district', COALESCE(district, ''),
        'block', COALESCE(block, ''),
        'panchayat', COALESCE(panchayat, ''),
        'village', COALESCE(village, '')
      )
      WHERE location = '{}'::jsonb AND (
        state IS NOT NULL OR
        district IS NOT NULL OR
        block IS NOT NULL OR
        panchayat IS NOT NULL OR
        village IS NOT NULL
      );
    `);

    // Step 2: Drop state, district, block, panchayat, village columns
    await queryInterface.removeColumn('Farmers', 'state');
    await queryInterface.removeColumn('Farmers', 'district');
    await queryInterface.removeColumn('Farmers', 'block');
    await queryInterface.removeColumn('Farmers', 'panchayat');
    await queryInterface.removeColumn('Farmers', 'village');
  },

  down: async (queryInterface, Sequelize) => {
    // Re-add columns
    await queryInterface.addColumn('Farmers', 'state', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });
    await queryInterface.addColumn('Farmers', 'district', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });
    await queryInterface.addColumn('Farmers', 'block', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });
    await queryInterface.addColumn('Farmers', 'panchayat', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });
    await queryInterface.addColumn('Farmers', 'village', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });

    // Restore data from location to columns
    await queryInterface.sequelize.query(`
      UPDATE "Farmers"
      SET
        state = COALESCE(location->>'state', ''),
        district = COALESCE(location->>'district', ''),
        block = COALESCE(location->>'block', ''),
        panchayat = COALESCE(location->>'panchayat', ''),
        village = COALESCE(location->>'village', '')
      WHERE location != '{}'::jsonb;
    `);
  },
};