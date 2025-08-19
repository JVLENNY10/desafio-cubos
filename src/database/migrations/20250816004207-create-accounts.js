'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accounts', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      branch: {
        allowNull: false,
        type: Sequelize.STRING,
        // validate: {
        //   len: [3, 3]
        // },
      },
      account: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      peopleId: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('accounts');
  }
};
