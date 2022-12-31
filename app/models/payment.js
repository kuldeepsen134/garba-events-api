module.exports = (sequelize, Sequelize) => {
  const Payment = sequelize.define('payments', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },

    order_id: {
      type: Sequelize.STRING,
    },
    customer_id: {
      type: Sequelize.STRING,
    },
    amount: {
      type: Sequelize.INTEGER,
    },
    payment_mode: {
      type: Sequelize.STRING,
    },
    transaction_data: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
      validate: {
        isIn: [['pending', 'completed', 'failed', 'hold']]
      }
    }
  },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Payment;
};