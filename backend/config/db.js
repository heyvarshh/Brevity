const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : {
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;
