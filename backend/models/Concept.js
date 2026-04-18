const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Concept = sequelize.define('Concept', {
  id: {
    type: DataTypes.INTEGER,
    primary_key: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  session_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'session',
      key: 'id',
    },
  },
}, {
  tableName: 'concept',
  timestamps: false,
});

module.exports = Concept;
