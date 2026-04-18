const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ActionItem = sequelize.define('ActionItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  type: {
    type: DataTypes.STRING
  },

  timestamp: {
    type: DataTypes.FLOAT
  },

  assignee: {
    type: DataTypes.STRING
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },

  session_id: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'action_items',
  timestamps: false
});

module.exports = ActionItem;
