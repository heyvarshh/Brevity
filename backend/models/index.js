const { Sequelize, DataTypes } = require('sequelize');

// Safe DB initialization (prevents crash)
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false
    })
  : null;

// Import models
const SessionModel = require('./Session');
const TranscriptChunkModel = require('./TranscriptChunk');
const SummaryModel = require('./Summary');
const ActionItemModel = require('./ActionItem');
const ConceptModel = require('./Concept');

// Initialize models ONLY if DB exists
let Session, TranscriptChunk, Summary, ActionItem, Concept;

if (sequelize) {
  Session = SessionModel(sequelize, DataTypes);
  TranscriptChunk = TranscriptChunkModel(sequelize, DataTypes);
  Summary = SummaryModel(sequelize, DataTypes);
  ActionItem = ActionItemModel(sequelize, DataTypes);
  Concept = ConceptModel(sequelize, DataTypes);

  // Associations
  Session.hasMany(TranscriptChunk, { as: 'transcript_chunks' });
  Session.hasMany(Summary, { as: 'summaries' });
  Session.hasMany(ActionItem, { as: 'action_items' });
  Session.hasMany(Concept, { as: 'concepts' });

  TranscriptChunk.belongsTo(Session);
  Summary.belongsTo(Session);
  ActionItem.belongsTo(Session);
  Concept.belongsTo(Session);
}

module.exports = {
  sequelize,
  Session,
  TranscriptChunk,
  Summary,
  ActionItem,
  Concept
};
