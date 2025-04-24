'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('Users', [
      {
        name: 'Super Admin',
        email: 'admin@example.com',
        password,
        role: 'SuperAdmin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('Locations', [
      {
        state: 'Maharashtra',
        locationData: JSON.stringify({
          districts: [
            {
              name: 'Pune',
              blocks: [
                {
                  name: 'Haveli',
                  panchayats: [
                    {
                      name: 'Khadakwasla',
                      villages: [
                        { name: 'Village1', coords: { lat: 18.45, long: 73.77 } },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Locations', null, {});
  },
};