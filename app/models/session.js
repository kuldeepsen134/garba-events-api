module.exports = (sequelize, Sequelize) => {
  const Session = sequelize.define('sessions', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    user_id: {
      type: Sequelize.STRING,
    },
    access_token: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
  },
    {
      underscored: true
    }
  );

  return Session;
};
