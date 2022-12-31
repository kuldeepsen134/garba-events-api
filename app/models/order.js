module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define('orders', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    amount: {
      type: Sequelize.FLOAT,
    },
    status: {
      type: Sequelize.STRING,
      validate: {
        isIn: [[
          'pending',
          'confirm',
          'cencelled',
        ]],
      }
    },
  },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Order;
};