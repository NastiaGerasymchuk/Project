const Sequelize = require('sequelize');
const db = require('../config/database');
const Address = require('./Address');


const Hospital = db.sequelize.define('hospital', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, 
    name_hosp: {    
        type: Sequelize.STRING, 
        allowNull: false
    },
    community: {
        type: Sequelize.ENUM('State', 'Private')
    }
   
}, { timestamps: false, underscored: true});

Hospital.belongsTo(Address);
Address.hasMany(Hospital);

module.exports = Hospital;