const { Sequelize } = require('sequelize');
require('dotenv').config();

const isLocal = process.env.DATABASE_URL?.includes('localhost');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: isLocal
      ? false
      : {
          require: true,
          rejectUnauthorized: false
        }
  }
});

module.exports = sequelize;
