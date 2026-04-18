const User = require('./User');
const Session = require('./Session');
const TranscriptChunk = require('./TranscriptChunk');
const Summary = require('./Summary');
const ActionItem = require('./ActionItem');
const Concept = require('./Concept');

// Associations
User.hasMany(Session, { foreignKey: 'owner_id', as: 'sessions' });
Session.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

Session.hasMany(TranscriptChunk, { foreignKey: 'session_id', as: 'transcript_chunks' });
TranscriptChunk.belongsTo(Session, { foreignKey: 'session_id', as: 'session' });

Session.hasMany(Summary, { foreignKey: 'session_id', as: 'summaries' });
Summary.belongsTo(Session, { foreignKey: 'session_id', as: 'session' });

Session.hasMany(ActionItem, { foreignKey: 'session_id', as: 'action_items' });
ActionItem.belongsTo(Session, { foreignKey: 'session_id', as: 'session' });

Session.hasMany(Concept, { foreignKey: 'session_id', as: 'concepts' });
Concept.belongsTo(Session, { foreignKey: 'session_id', as: 'session' });

module.exports = {
  User,
  Session,
  TranscriptChunk,
  Summary,
  ActionItem,
  Concept
};
