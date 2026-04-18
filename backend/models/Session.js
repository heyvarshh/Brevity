module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Session", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    source_url: DataTypes.TEXT,
    source_type: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending"
    }
  }, {
    tableName: "sessions",
    timestamps: false
  });
};
