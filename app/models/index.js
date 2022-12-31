const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB, process.env.DBUSER, process.env.DBPASSWORD, {
  host: process.env.DBHOST,
  dialect: 'mysql',
  operatorsAliases: 0,
  // dialectOptions: {
  //   ssl: {
  //     MYSQL_ATTR_SSL_CA: '/etc/ssl/cert.pem',
  //   }
  // },

  hooks: {
    beforeDefine: function (columns, model) {
      // model.tableName = 'retailpos123_' + model.name.plural;
    },
    afterCreate: (record) => {
      delete record.dataValues.password;
    },
    afterUpdate: (record) => {
      delete record.dataValues.password;
    },
  },
  define: {
    timestamps: true,
    freezeTableName: true
  },

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
const db = {
  sequelize: sequelize,
  User: require('./user')(sequelize, Sequelize),
  Order: require('./order')(sequelize, Sequelize),
  OrderItem: require('./order-item')(sequelize, Sequelize),
  Payment: require('./payment')(sequelize, Sequelize),
  Session: require('../models/session')(sequelize, Sequelize),

};

// Association

db.Order.belongsTo(db.User, { constraints: false, foreignKey: 'id' });
db.User.hasMany(db.Order, { constraints: false, foreignKey: 'customer_id' });

db.OrderItem.belongsTo(db.Order, { constraints: false, foreignKey: 'id' });
db.Order.hasMany(db.OrderItem, { constraints: false, foreignKey: 'order_id' });

module.exports = db;

db.sequelize.sync({ alter: false, force: false }).then(() => {
  console.log('Yes re-sync');
});
