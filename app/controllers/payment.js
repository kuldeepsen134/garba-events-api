const Razorpay = require('razorpay')

const { Payment, Order } = require('../models/index');
const { handleResponse, handleError, handleSearchQuery, getPagination, getPagingResults, sortingData } = require('../utils/helpers');

exports.create = async (req, res) => {
  const order = await Order.findAll({ where: { id: req.body.order_id, customer_id: req.body.customer_id, } })
  if (order.length > 0) {
    let amount = 0
    order.map((order) => {
      amount = order.amount
    })

    const data = {
      order_id: req.body.order_id,
      cutomer_id: req.body.customer_id,
      amount: amount,
      payment_mode: req.body.payment_mode,
      transaction_data: req.body.transaction_data,
      status: req.body.status,
    };

    const Razorpay = require('razorpay');
    var instance = new Razorpay({ key_id: 'rzp_test_O8ROjLhIyyGbng', key_secret: 'Htv2XY5fAzX1Ea27oOYQq7Jc' })
    var options = {
      amount: amount,  // amount in the smallest currency unit
      currency: "INR",
      receipt: "rcpt_id_"
    };

    instance.orders.create(options, function (err, order) {
      console.log(order);
    });

    Payment.create(data)
      .then(async (data) => {
        handleResponse(res, data, 'Your payment is succesfull');
      }).catch(err => {
        handleError(err, req, res);
      });
  }
  else {
    res.send(400, {
      error: true,
      message: 'Customer and order_id does not exist'
    })
  }
};

exports.findAll = (req, res) => {
  const { page, size, } = req.query;
  const { limit, offset } = getPagination(page, size);

  const sortResponse = sortingData(req);

  Payment.findAndCountAll(
    {
      where: handleSearchQuery(req, ['order_id', 'city', 'country']),
      order: [[sortResponse.sortKey, sortResponse.sortValue]],
      limit, offset,
    }
  ).then(data => {
    handleResponse(res, getPagingResults(data, page, limit));
  }).catch(err => {
    handleError(err, req, res);
  });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Payment.findByPk(id)
    .then(data => {
      handleResponse(res, data);
    }).catch(err => {
      handleError(err, req, res);
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Payment.update(req.body, { where: { id: id } })
    .then(data => {
      handleResponse(res, data);
    }).catch(err => {
      handleError(err, req, res);
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Payment.destroy({
    where: { id: id }
  }).then(data => {
    handleResponse(res, data);
  }).catch(err => {
    handleError(err, req, res);
  });
};