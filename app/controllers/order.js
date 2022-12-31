const qr = require('qrcode');

const { Order, OrderItem, Session, } = require('../models/index');
const { handleError, getPagination, handleSearchQuery, getPagingResults, handleResponse, sortingData, } = require('../utils/helpers');

exports.create = async (req, res) => {

  const session = await Session.findOne({ where: { access_token: req.body.access_token } })
  if (session) {
    const data = {
      access_token: req.body.access_token,
    };

    let totalAmount = 0
    req.body.order_items.map((item) => {
      totalAmount = totalAmount + item.guests.length * 20
    })

    data.amount = totalAmount
    data.status = 'pending'

    Order.create(data).then(async (data) => {

      let orderItemData = [];

      req.body.order_items.map((item) => {
        item.guests.map((guest) => {
          orderItemData.push({
            order_id: data.id,
            product_id: 1,
            variation_id: 0,
            quantity: 1,
            subtotal: 20,
            total: 20,
            tax_subtotal: 0,
            tax_total: 0,
            order_item_type: 'line_item',
            full_name: guest.full_name,
            phone_number: guest.phone_number,
            status: 'pending'
          })
        })
      })

      const orderItems = await OrderItem.bulkCreate(orderItemData)
      // let qrData = JSON.stringify(data)

      // qr.toString(qrData, { type: 'terminal' },
      //   function (err, code) {
      //     if (err)
      //       return handleError(err, req, res, 'Error occure')
      //     console.log(code)
      //   });

      handleResponse(res, data, 'Order successfully created');
    })
      .catch(err => {
        handleError(err, req, res,);
      });
  }
  else {
    res.send(400, {
      error: true,
      message: 'User not found'
    })
  }

};

exports.findAll = (req, res) => {
  const { page, size, } = req.query;
  const { limit, offset } = getPagination(page, size);

  const sortResponse = sortingData(req);
  Order.findAndCountAll(
    {
      where: handleSearchQuery(req, ['order_number', 'customer_id', 'city', 'user_id']),
      order: [[sortResponse.sortKey, sortResponse.sortValue]],
      limit, offset,
      include: [
        { model: OrderItem },
      ]
    }
  ).then(data => {
    handleResponse(res, getPagingResults(data, page, limit));
  }).catch(err => {
    handleError(err, req, res);
  });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Order.findByPk(id)
    .then(data => {
      handleResponse(res, data);
    }).catch(err => {
      handleError(err, req, res);
    });
};

exports.findGuests = async (req, res) => {
  const id = req.params.id;
  const orderItemData = await OrderItem.findAll({
    where: { order_id: id },
  })
    .then(data => {
      let data1 = data.map((item) => {
        return ({
          id: item.id,
          full_name: item.full_name,
          phone_number: item.phone_number,
          status: item.status
        })
      })

      handleResponse(res, data1,);
    }).catch(err => {
      handleError(err, req, res);
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Order.update(req.body, { where: { id: id } })
    .then(data => {
      handleResponse(res, data);
    }).catch(err => {
      handleError(err, req, res);
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Order.destroy({
    where: { id: id }
  }).then(data => {
    handleResponse(res, data);
  }).catch(err => {
    handleError(err, req, res);
  });
};