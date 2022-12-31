var router = require('express').Router();
const { OrderItem } = require('../controllers/index');

module.exports = app => {
  router.post('/orderItem', OrderItem.create);
  router.put('/orderItem/:id', OrderItem.update);
  router.post('/attendance', OrderItem.attendance);
  router.get('/orderItem', OrderItem.findAll);
  router.get('/orderItem/:id', OrderItem.findOne);
  router.delete('/orderItem/:id', OrderItem.delete);

  app.use('/', router);
};