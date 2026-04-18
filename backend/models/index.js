const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// IMPORTANT: factory-style imports ONLY
const SessionModel = require('./Session');
const TranscriptChunkModel = require('./TranscriptChunk');
const SummaryModel = require('./Summary');
const ActionItemModel = require('./ActionItem');
const ConceptModel = require('./Concept');

// INIT MODELS (correct way)
const Session = SessionModel(sequelize, DataTypes);
const TranscriptChunk = TranscriptChunkModel(sequelize, DataTypes);
const Summary = SummaryModel(sequelize, DataTypes);
const ActionItem = ActionItemModel(sequelize, DataTypes);
const Concept = ConceptModel(sequelize, DataTypes);

// ASSOCIATIONS
Session.hasMany(TranscriptChunk, { foreignKey: 'session_id', as: 'transcript_chunks' });
Session.hasMany(Summary, { foreignKey: 'session_id', as: 'summaries' });
Session.hasMany(ActionItem, { foreignKey: 'session_id', as: 'action_items' });
Session.hasMany(Concept, { foreignKey: 'session_id', as: 'concepts' });

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
  Concept
};
