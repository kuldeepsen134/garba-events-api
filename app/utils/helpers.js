const { ProductTag, OrderItem, ProductCategory, Session, User, Categories, Tag, } = require('../models');

exports.handleError = (error, req, res, message) => {
  if (error.details) {
    error.details.map((item) => {
      res.status(400).send({
        message: item.message.replaceAll('"', ''),
        error: true
      });
    });
    return;
  }
  res.status(400).send({
    error: true,
    message: error.error ? error.error.message : error.errors ? error.errors.map(e => e.message) : error?.original?.sqlMessage ? error?.original?.sqlMessage : error.message,
  });
};

exports.handleResponse = (res, data, message) => {
  console.log(message);
  res.status(200).send({
    data,
    message,
    error: false
  });
};

exports.getTokenData = async (params) => {
  const access_token = params.token;
  const user = await Session.findOne({ where: { access_token: access_token } });

  const user1 = await User.findOne({ where: { id: user.user_id } });
  if (user1) {
    return user1;
  }
  else {
    return {
      message: 'User does not exist in user table.'
    };
  }
};

const { Op } = require('sequelize');

exports.handleSearchQuery = (req, fields) => {
  const { filters, q } = req.query;
  const query = [];

  let queryKeys = fields.map((key) => {
    return { [key]: { [Op.like]: q } };
  });

  q && query.push({
    [Op.or]: queryKeys
  });

  filters && query.push(filters);
  return query;
};

exports.getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? (page - 1) * limit : 0;
  return { limit, offset };
};

exports.getPagingResults = (data, page, limit) => {
  const { count: total_items, rows: items } = data;
  const current_page = page ? +page : 1;
  const total_pages = Math.ceil(total_items / limit);
  const per_page = limit;
  return { items, pagination: { total_items, per_page, total_pages, current_page } };
};


exports.generateOTP = () => {
  var digits = '0123456789'; var otpLength = 6; var otp = '';

  for (let i = 1; i <= otpLength; i++) {
    var index = Math.floor(Math.random() * (digits.length));
    otp = otp + digits[index];
  }

  return otp;
};

exports.createUUID = () => {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};

exports.sortingData = (req) => {
  const { sort } = req.query;
  const sortKey = sort ? sort.replace('-', '') : 'created_at';
  const sortValue = sort ? sort.includes('-') ? 'DESC' : 'ASC' : 'DESC';

  return { sortKey, sortValue };
};

exports.orderVerify = () => {

  app.post("/api/payment/verify", (req, res) => {

    let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

    var crypto = require("crypto");
    var expectedSignature = crypto.createHmac('sha256', '<YOUR_API_SECRET>')
      .update(body.toString())
      .digest('hex');
    console.log("sig received ", req.body.response.razorpay_signature);
    console.log("sig generated ", expectedSignature);
    var response = { "signatureIsValid": "false" }
    if (expectedSignature === req.body.response.razorpay_signature)
      response = { "signatureIsValid": "true" }
    res.send(response);
  });
}
