const { OrderItem, User } = require('../models/index');
const { handleResponse, handleError } = require('../utils/helpers');

exports.create = async (req, res) => {
  const data = {
    customer_id: req.body.customer_id,
    order_items: req.body.order_items
  };

  Order.create(data)
    .then(data => {
      handleResponse(res, data);
    }).catch(err => {
      handleError(err, req, res);
    });
};

exports.findAll = (req, res) => {
  OrderItem.findAndCountAll()
    .then(data => {
      handleResponse(res, data);
    }).catch(err => {
      handleError(err, req, res);
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  OrderItem.findByPk(id)
    .then(data => {
      handleResponse(res, data);
    }).catch(err => {
      handleError(err, req, res);
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  OrderItem.update(req.body, { where: { id: id } })
    .then(data => {
      handleResponse(res, data);
    }).catch(err => {
      handleError(err, req, res);
    });
};

exports.attendance = (req, res) => {
  const ids = []
  let status
  req.body.guests.map(async (guest) => {
    guest.id
    ids.push(guest.id)
    status = guest.status
  })

  OrderItem.update({ status: `${status}` }, {
    where: {
      id: ids
    }
  }).then(data => {
    handleResponse(res, data, `${data} Guests is presented`);
  }).catch(err => {
    handleError(err, req, res);
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  OrderItem.destroy({
    where: { id: id }
  }).then(data => {
    handleResponse(res, data);
  }).catch(err => {
    handleError(err, req, res);
  });
};