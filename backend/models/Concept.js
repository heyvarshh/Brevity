module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Concept", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    session_id: DataTypes.INTEGER
  }, {
    tableName: "concepts",
    timestamps: false
  });
};
