const users = require('./user');
const orders = require('./order');
const OrderItem = require('./order-item');
const payments = require('./payment');
const Auth = require('../controllers/auth');

module.exports = {
  users,
  orders,
  OrderItem,
  payments,
  Auth,
};