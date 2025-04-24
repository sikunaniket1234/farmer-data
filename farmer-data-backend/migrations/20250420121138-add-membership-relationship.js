'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Memberships', {
      fields: ['farmerId'],
      type: 'foreign key',
      name: 'fk_membership_farmerid',
      references: {
        table: 'Farmers',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Add a unique constraint to ensure one-to-one relationship
    await queryInterface.addIndex('Memberships', {
      fields: ['farmerId'],
      unique: true,
      name: 'unique_farmerid_membership',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Memberships', 'unique_farmerid_membership');
    await queryInterface.removeConstraint('Memberships', 'fk_membership_farmerid');
  },
};