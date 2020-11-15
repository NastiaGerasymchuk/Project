const Sequelize = require('sequelize');
const db = require('../config/database');
//
const Address = db.sequelize.define('addresses', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, 
    city_village: {    
        type: Sequelize.STRING, 
        allowNull: false
    },
    street: {    
        type: Sequelize.TEXT, 
        allowNull: false
    },
    house_number: {    
        type: Sequelize.INTEGER, 
        allowNull: false
    },
    flatNumber: {    
        type: Sequelize.INTEGER, 
    },
   
}, 

{ timestamps: false, underscored: true},);



module.exports = Address;

// select *
// from persons inner join addresses on addresses.id=address_id
// where city_village LIKE 'Khotyn'
