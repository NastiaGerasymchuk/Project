const Sequelize = require('sequelize');
const db = require('../config/database');
const Person = require('./Person');
const JobTitle = require('./JobTitle');

const Doctor = db.sequelize.define('doctors', {
    id: {
        type: Sequelize.INTEGER, // sequilize.primary key
        autoIncrement: true,
        primaryKey: true,
    }, 
   
}, { timestamps: false, underscored: true});

Doctor.belongsTo(Person); // Doctor has list of person
Person.hasOne(Doctor);

Doctor.belongsTo(JobTitle);
JobTitle.hasMany(Doctor);

module.exports = Doctor;