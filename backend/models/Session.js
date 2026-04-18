const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.INTEGER,
    primary_key: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  source_url: {
    type: DataTypes.STRING,
  },
  file_path: {
    type: DataTypes.STRING,
  },
  source_type: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  owner_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'user',
      key: 'id',
    },
  },
}, {
  tableName: 'session',
  timestamps: false,
});

module.exports = Session;
