module.exports = (sequelize, DataTypes) => {
  const TranscriptChunk = sequelize.define(
    "TranscriptChunk",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      content: {
        type: DataTypes.TEXT
      },

      start_time: {
        type: DataTypes.FLOAT
      },

      end_time: {
        type: DataTypes.FLOAT
      },

      speaker: {
        type: DataTypes.STRING
      },

      session_id: {
        type: DataTypes.INTEGER
      }
    },
    {
      tableName: "transcript_chunks",
      timestamps: false,
      freezeTableName: true
    }
  );

  return TranscriptChunk;
};
