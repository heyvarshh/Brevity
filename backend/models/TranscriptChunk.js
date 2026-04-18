const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TranscriptChunk = sequelize.define('TranscriptChunk', {
  id: {
    type: DataTypes.INTEGER,
    primary_key: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  speaker: {
    type: DataTypes.STRING,
  },
  session_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'session',
      key: 'id',
    },
  },
}, {
  tableName: 'transcriptchunk',
  timestamps: false,
});

module.exports = TranscriptChunk;
