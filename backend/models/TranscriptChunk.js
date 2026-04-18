module.exports = (sequelize, DataTypes) => {
  return sequelize.define("TranscriptChunk", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: DataTypes.TEXT,
    start_time: DataTypes.FLOAT,
    end_time: DataTypes.FLOAT,
    speaker: DataTypes.STRING,
    session_id: DataTypes.INTEGER
  }, {
    tableName: "transcript_chunks",
    timestamps: false
  });
};
