const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ActionItem = sequelize.define('ActionItem', {
  id: {
    type: DataTypes.INTEGER,
    primary_key: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
  },
  timestamp: {
    type: DataTypes.FLOAT,
  },
  assignee: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  session_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'session',
      key: 'id',
    },
  },
}, {
  tableName: 'actionitem',
  timestamps: false,
});

module.exports = ActionItem;
