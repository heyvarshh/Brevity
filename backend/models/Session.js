module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Session', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING
    },
    source_url: {
      type: DataTypes.TEXT
    },
    source_type: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'sessions'
  });
};
