const express = require('express');
//const { Sequelize } = require('sequelize/types');
const { Sequelize } = require('sequelize');
const Person = require('../models/Person');
const Schedule = require('../models/Schedule');
const TimeSlot = require('../models/TimeSlot');

const sequelize = require('../config/database');

const getTimeslotByDoctorIdAndDate= async (doctorId,dateVisiting)=>{//date from to 7 days
  const doctors=  await sequelize.sequelize.query(` SELECT "timeSlot"."start_time" AS "start_time", 
    "timeSlot"."end_time" AS "end_time", "timeSlot"."date_visiting" AS "date_visiting",
    "workPlace"."doctor_id" AS "doctor_id"
     FROM "time_slots" AS "timeSlot" INNER JOIN "schedules" AS "schedule"
     ON "timeSlot"."schedule_id" = "schedule"."id" INNER JOIN 
     "work_places" AS "workPlace" ON "schedule"."work_place_id" = "workPlace"."id" 
    WHERE "workPlace"."doctor_id"=:doctor_id AND "timeSlot"."date_visiting"=:date_visiting`,
    {
      replacements: { doctor_id: doctorId,date_visiting:dateVisiting},
      type: Sequelize.SELECT 
    });
   return doctors[0];
}

const getTimeslotByDoctorId= async (doctorId)=>{
    const doctors=  await sequelize.sequelize.query(` SELECT "timeSlot"."start_time" AS "start_time", 
      "timeSlot"."end_time" AS "end_time", "timeSlot"."date_visiting" AS "date_visiting",
      "workPlace"."doctor_id" AS "doctor_id"
       FROM "time_slots" AS "timeSlot" INNER JOIN "schedules" AS "schedule"
       ON "timeSlot"."schedule_id" = "schedule"."id" INNER JOIN 
       "work_places" AS "workPlace" ON "schedule"."work_place_id" = "workPlace"."id" 
      WHERE "workPlace"."doctor_id"=:doctor_id`,
      {
        replacements: { doctor_id: doctorId},
        type: Sequelize.SELECT 
      });
     return doctors[0];
  }

module.exports.getTimeslotByDoctorIdAndDate = getTimeslotByDoctorIdAndDate;
module.exports.getTimeslotByDoctorId = getTimeslotByDoctorId



