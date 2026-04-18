module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Summary", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    mode: {
      type: DataTypes.STRING
    },

    content: {
      type: DataTypes.TEXT
    },

    session_id: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: "summaries",
    timestamps: false
  });
};
