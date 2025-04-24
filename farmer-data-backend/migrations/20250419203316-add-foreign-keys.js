module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Farmers', {
      fields: ['ceoId'],
      type: 'foreign key',
      name: 'fk_farmers_ceoId_users',
      references: { table: 'Users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('Memberships', {
      fields: ['ceoId'],
      type: 'foreign key',
      name: 'fk_memberships_ceoId_users',
      references: { table: 'Users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('Memberships', {
      fields: ['farmerId'],
      type: 'foreign key',
      name: 'fk_memberships_farmerId_farmers',
      references: { table: 'Farmers', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeConstraint('Farmers', 'fk_farmers_ceoId_users');
    await queryInterface.removeConstraint('Memberships', 'fk_memberships_ceoId_users');
    await queryInterface.removeConstraint('Memberships', 'fk_memberships_farmerId_farmers');
  },
};