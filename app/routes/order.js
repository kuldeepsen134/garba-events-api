var router = require('express').Router();
const { orders } = require('../controllers/index');

module.exports = app => {
  router.post('/', orders.create);
  router.put('/:id', orders.update);
  router.get('/', orders.findAll);
  router.get('/:id', orders.findOne);
  router.delete('/:id', orders.delete);
  router.get('/:id/guests', orders.findGuests);

  app.use('/orders', router);
};