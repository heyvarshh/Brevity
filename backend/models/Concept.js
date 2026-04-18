const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Concept = sequelize.define('Concept', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  name: {
    type: DataTypes.STRING
  },

  description: {
    type: DataTypes.TEXT
  },

  session_id: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'concepts',
  timestamps: false
});

module.exports = Concept;
