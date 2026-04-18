module.exports = (sequelize, DataTypes) => {
  return sequelize.define("ActionItem", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: DataTypes.STRING,
    timestamp: DataTypes.FLOAT,
    assignee: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending"
    },
    session_id: DataTypes.INTEGER
  }, {
    tableName: "action_items",
    timestamps: false
  });
};
