var router = require('express').Router();
const { payments } = require('../controllers/index');

module.exports = app => {
  router.post('/', payments.create);
  router.put('/:id', payments.update);
  router.get('/', payments.findAll);
  router.get('/:id', payments.findOne);
  router.delete('/:id', payments.delete);

  app.use('/payments', router);
};