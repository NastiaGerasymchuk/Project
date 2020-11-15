const Sequelize = require('sequelize');
const db = require('../config/database');

const JobTitle = db.sequelize.define('job_titles', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, 
    title: {    
        type: Sequelize.STRING, 
        allowNull: false
    },
   
}, { timestamps: false, underscored: true});

module.exports = JobTitle;