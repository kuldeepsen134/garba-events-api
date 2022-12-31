module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    first_name: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
    token: {
      type: Sequelize.UUID
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
    },
    gender: {
      type: Sequelize.STRING,
      validate: {
        isIn: [['mrs.', 'mr.',]],
      }
    },
  },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return User;
};