const Sequelize = require('sequelize');
const db = require('../config/database');
const WorkPlace = require('./WorkPlace');


const Schedule = db.sequelize.define('schedule', {
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
    day_of_week: {
        type: Sequelize.ENUM('Monday', 'Tuesday', 'Wedndesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
    }


   
}, { timestamps: false, underscored: true});

Schedule.belongsTo(WorkPlace);
WorkPlace.hasMany(Schedule);

module.exports = Schedule;