const Sequelize = require('sequelize');
const db = require('../config/database');
const Hospital = require('./Hospital');
const Doctor = require('./Doctor');


const WorkPlace =db.sequelize.define('workPlace', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, 
    cabinet_number: {
        type: Sequelize.INTEGER
    }
   
}, { timestamps: false, underscored: true});

WorkPlace.belongsTo(Hospital);
Hospital.hasMany(WorkPlace);

WorkPlace.belongsTo(Doctor);
Doctor.hasMany(WorkPlace);

module.exports = WorkPlace;