const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Summary = sequelize.define('Summary', {
  id: {
    type: DataTypes.INTEGER,
    primary_key: true,
    autoIncrement: true,
  },
  mode: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  session_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'session',
      key: 'id',
    },
  },
}, {
  tableName: 'summary',
  timestamps: false,
});

module.exports = Summary;
