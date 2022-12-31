var router = require('express').Router();
const { users } = require('../controllers/index');

module.exports = app => {
	router.post('/', users.create);
	router.put('/:id', users.update);
	router.get('/', users.findAll);
	router.get('/:id', users.findOne);
	router.delete('/:id', users.delete);

	app.use('/users', router);
};