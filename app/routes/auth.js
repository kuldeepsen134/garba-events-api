var router = require('express').Router();
const { Auth } = require('../controllers/index');

module.exports = app => {
  router.post('/login', Auth.login);
  router.post('/reset-password-email', Auth.forgotPassword);
  router.post('/update-password', Auth.forgotPasswordVerify);
  router.post('/login/me', Auth.me);

  app.use('/', router);
};