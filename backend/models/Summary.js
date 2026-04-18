module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Summary", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    mode: DataTypes.STRING,
    content: DataTypes.TEXT,
    session_id: DataTypes.INTEGER
  }, {
    tableName: "summaries",
    timestamps: false
  });
};
