const Sequelize = require('sequelize');
const db = require('../config/database');
const Person = require('./Person');
const Schedule = require('./Schedule');


const TimeSlot = db.sequelize.define('timeSlot', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, 
    start_time: {
        type: Sequelize.TIME,
    },
    end_time: {
        type: Sequelize.TIME,
    },
    
    date_visiting: {
        type: Sequelize.DATEONLY
    }

   
}, { timestamps: false, underscored: true});

TimeSlot.belongsTo(Schedule);
Schedule.hasMany(TimeSlot);
TimeSlot.belongsTo(Person);
Person.hasMany(TimeSlot);


module.exports = TimeSlot;