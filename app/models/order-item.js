module.exports = (sequelize, Sequelize) => {
  const OrderItem = sequelize.define('order_items', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    order_id: {
      type: Sequelize.STRING,
    },

    product_id: {
      type: Sequelize.STRING,
    },
    variation_id: {
      type: Sequelize.STRING,
    },
    quantity: {
      type: Sequelize.INTEGER,
    },
    subtotal: {
      type: Sequelize.FLOAT,
    },
    total: {
      type: Sequelize.FLOAT,
    },
    tax_subtotal: {
      type: Sequelize.FLOAT,
    },
    tax_total: {
      type: Sequelize.FLOAT,
    },
    order_item_type: {
      type: Sequelize.STRING,
      validate: {
        isIn: [['line_item', 'shipping', 'discount']]
      }
    },
    full_name: {
      type: Sequelize.STRING,
    },
    phone_number: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
  },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return OrderItem;
};