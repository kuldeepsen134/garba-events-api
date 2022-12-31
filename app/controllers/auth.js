const nodemailer = require('nodemailer');

const md5 = require('md5');
const models = require('../models');
const User = models.User;
const Session = models.Session;

const { handleError, createUUID } = require('../utils/helpers');
const { loginValidation, forgotPasswordValidation, forgotPasswordVerifyValidation } = require('./schema');

exports.login = async (req, res) => {
  const { error, value } = loginValidation.validate(req.body,);

  if (error) {
    handleError(error, req, res);
    return;
  }

  const email = req.body.email;
  const password = md5(req.body.password);

  const user = await User.findOne({ where: { email: email, password: password } });
  if (user) {
    const [session, created] = await Session.findOrCreate({ where: { user_id: user.id } });

    if (created === false) {
      const uuid = createUUID();
      session.update({
        access_token: uuid,
      }, {
        where: { id: user.id }
      });
      return res.send({
        message: 'Logged in successfully.',
        access_token: uuid,
        user_id: user.id,
        error: false
      });
    }
  }
  else {
    res.status(400).send({
      message: 'Email or Password Incorrect.',
      error: true
    });
  }
};
let Link;
exports.forgotPassword = async (req, res) => {

  const { error, value } = forgotPasswordValidation.validate(req.body,);

  if (error) {
    handleError(error, req, res);
    return;
  }

  const user = await User.findOne({ where: { email: req.body.email } });
  if (user === null) {
    res.status(400).send({ error: true, message: 'User not found' });
  }

  if (user) {
    const email = req.body.email;
    const token = createUUID();
    const [user, created] = await User.findOrCreate({
      where: { email: email },
      defaults: {
        email: email,
        token: token,
      }
    })
      .catch(err => {
        handleError(err, req, res);
      });
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.sendinblue.com',
      port: 587,
      auth: {
        user: 'sandbox4project@gmail.com',
        pass: 'LMh1xOkNdR90PfaZ'
      },
      // secure: true
    });

    const link = `${process.env.BASE_URL}?token=${token}`;
    Link = link;

    const data = {
      from: 'Navratri Garba<sandbox4project@gmail.com>',
      to: `${email}`,
      subject: 'Your login code to - Navratri Garba',
      html: `'Your forgot password code to - Navratri Garba', <h1>Hi ${user.first_name}</h1><p>Please<a href=${link}>click here </a>to generate a new password reset email</p>`,
    };

    transporter.sendMail(data, (error, info) => {
      if (error) {
        return res.status(error.responseCode).send(error);
      }
      res.send({
        message: `Check your email for the login code. We have sent it to ${email}`,
        message_id: info.messageId,
      });
    });

    if (created === false) {
      User.update({
        email: email,
        token: token
      }, { where: { id: user.id } })
        .catch(err => {
          handleError(err, req, res);
        });
    }
  }
};

exports.forgotPasswordVerify = async (req, res) => {

  const { error, value } = forgotPasswordVerifyValidation.validate(req.body,);

  if (error) {
    handleError(error, req, res);
    return;
  }

  const token = req.body.token;
  const newPassword = req.body.new_password;
  const confirmPassword = req.body.confirm_password;

  if (newPassword === confirmPassword) {
    const password = newPassword;
    const user = await User.findOne({ where: { token: token } });
    if (user) {
      User.update({
        token: null,
        password: md5(password)
      },
        { where: { id: user.id } })
        .catch(err => {
          handleError(err, req, res);
        });
      return res.send(200, {
        message: 'You successfully reset your password',
        error: false
      });
    }

  } else {
    return res.status(400).send({
      message: 'Confirm password does not match',
      error: true
    });
  }
  return res.status(400).send({
    message: 'This verification link has already been used',
    error: true
  });
};

exports.me = async (req, res) => {
  if ((req.headers.authorization)) {
    const access_token = req.headers.authorization;
    const user = await Session.findOne({ where: { access_token: access_token } });

    if (user) {
      const data = await User.findOne({ where: { id: user.user_id } });
      return res.send({
        message: 'Me login is successfully',
        data: data
      });
    }
  }
  return res.status(401).send({ error: true, message: 'Unauthorized access!' });
};