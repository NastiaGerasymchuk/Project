const Sequelize = require('sequelize');

const HOST_ADDRESS = process.env.db_host;
const DB_NAME = process.env.db_name;
const USER_NAME = process.env.user_name;
const USER_PASSWORD = process.env.user_password;

// module.exports = new Sequelize(DB_NAME, USER_NAME, USER_PASSWORD, {
//     host: HOST_ADDRESS,
//     dialect: 'postgres'
// });


const sequelize  = new Sequelize('helsi', 'postgres', '6116', {
    host: "23.251.131.44",
    dialect: 'postgres',
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  
  
    // SQLite only
    //storage: 'path/to/database.sqlite',
  
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: true
  });

  module.exports.sequelize= sequelize;
  
