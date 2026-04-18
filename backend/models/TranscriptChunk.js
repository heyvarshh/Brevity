module.exports = (sequelize, DataTypes) => {
  return sequelize.define("TranscriptChunk", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
  }, {
    tableName: "transcript_chunks",
    timestamps: false
  });
};
