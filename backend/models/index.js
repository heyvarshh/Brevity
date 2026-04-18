const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Session = require('./Session')(sequelize, DataTypes);
const TranscriptChunk = require('./TranscriptChunk')(sequelize, DataTypes);
const Summary = require('./Summary')(sequelize, DataTypes);
const ActionItem = require('./ActionItem')(sequelize, DataTypes);
const Concept = require('./Concept')(sequelize, DataTypes);
const User = require('./User')(sequelize, DataTypes);

// Associations
Session.hasMany(TranscriptChunk, { foreignKey: 'session_id' });
Session.hasMany(Summary, { foreignKey: 'session_id' });
Session.hasMany(ActionItem, { foreignKey: 'session_id' });
Session.hasMany(Concept, { foreignKey: 'session_id' });

TranscriptChunk.belongsTo(Session, { foreignKey: 'session_id' });
Summary.belongsTo(Session, { foreignKey: 'session_id' });
ActionItem.belongsTo(Session, { foreignKey: 'session_id' });
Concept.belongsTo(Session, { foreignKey: 'session_id' });

module.exports = {
  sequelize,
  Session,
  TranscriptChunk,
  Summary,
  ActionItem,
  Concept,
  User
};
