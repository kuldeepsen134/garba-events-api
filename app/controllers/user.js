const md5 = require('md5');
const { User } = require('../models/index');

const { handleError, handleSearchQuery, getPagination, getPagingResults, handleResponse, sortingData } = require('../utils/helpers');
const { registerValidation } = require('./schema');

exports.create = async (req, res) => {

  const { error, value } = registerValidation.validate(req.body,);

  if (error) {
    handleError(error, req, res)
    return
  }

  const data = {
    id: req.body.id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: md5(req.body.password),
    gender: req.body.gender,
  };

  User.create(data)
    .then(data => {
      handleResponse(res, data, 'User successfully created');
    }).catch(err => {

      handleError(err, req, res);
    });
};

exports.findAll = (req, res) => {
  const { page, size, sort } = req.query;
  const { limit, offset } = getPagination(page, size);
  const sortKey = sort ? sort.replace('-', '') : 'created_at';
  const sortValue = sort ? sort.includes('-') ? 'DESC' : 'ASC' : 'DESC';

  const sortResponse = sortingData(req);

  User.findAndCountAll(
    {
      where: handleSearchQuery(req, ['first_name', 'last_name', 'email', 'id']),
      order: [[sortResponse.sortKey, sortResponse.sortValue]],
      limit, offset,
      attributes: { exclude: ['password'] },
    }
  )
    .then(data => {
      handleResponse(res, getPagingResults(data, page, limit));
    }).catch(err => {
      handleError(err, req, res);
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id, {
  })
    .then(data => {
      handleResponse(res, data);
    }).catch(err => {
      handleError(err, req, res);
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, { where: { id: id } })
    .then(data => {
      handleResponse(res, data);
    }).catch(err => {
      handleError(err, req, res);
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id }
  }).then(data => {
    handleResponse(res, data);
  }).catch(err => {
    handleError(err, req, res);
  });
};