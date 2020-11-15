const express = require('express');
//const { Sequelize } = require('sequelize/types');
const { Sequelize } = require('sequelize');
const Person = require('../models/Person');
const Schedule = require('../models/Schedule');
const TimeSlot = require('../models/TimeSlot');

const sequelize = require('../config/database');
const { getTimeslotByDoctorIdAndDate,getTimeslotByDoctorId } = require('../database.js/timeslot');

const router = express.Router();
////
function putToTimeRange(arrVisiting,start_time,end_time){
  if(arrVisiting.length==0)return false;
  console.log(arrVisiting)
  if(arrVisiting[0].start_time>start_time&&arrVisiting[0].start_time>end_time){
    return true;
    }
    else if(arrVisiting[arrVisiting.length-1].end_time<start_time){
    return true;
    }
    else{
    for(let i=0;i<arrVisiting.length-1;i++){
      if(arrVisiting[i].start_time==start_time){
        return false;
      }
      else if(i+1<=arrVisiting.length-1){
        if((arrVisiting[i].start_time<start_time&&arrVisiting[i].end_time<=start_time)
        &&(arrVisiting[i+1].start_time>start_time&&arrVisiting[i+1].start_time>=end_time)){
          return true;
        }
      }
    
    }}
    return false;
  
  
}
/////чи помістимося у діапазон початку і кінця
async function getScheduleById(schedule_id){   
    schedules=await sequelize.sequelize.query(`Select * From "schedules" where "id"=:schedule_id`,
        {
            replacements: { schedule_id:schedule_id},
     
        type: Sequelize.SELECT 
        }); 
        return schedules[0];
 
}
function fromStringToTime(timeString,current_date){
    let timeArr=timeString.split(':'); 
    let date=new Date(current_date.getTime());   
    date.setHours(timeArr[0],timeArr[1],timeArr[2]);
    return date.getTime();
}
async function scheduleKeepsStartEnd(schedule_id,st_time, e_time){
    let scheduleRes=await getScheduleById(schedule_id).then(result=>result);
    let currentDate=new Date();    
    let schedule_start=fromStringToTime(scheduleRes[0].start_time,currentDate);    
    let schedule_end=fromStringToTime(scheduleRes[0].end_time,currentDate);
    let start=fromStringToTime(st_time,currentDate);
    let end=fromStringToTime(e_time,currentDate); 
    let res;  
    if(schedule_start<=start&&schedule_end>=end){
        res=true;
    }
    else{
        res=false;
    }
    return res;
    
}


async function getPersonFree(person_id,date_Visiting,start_time){  
let dateVisiting=(new Date(date_Visiting));
    persons=await sequelize.sequelize.query(`Select * From "time_slots" where "person_id"=:person_id
     AND "date_visiting"=:dateVisiting 
     order by start_time   
    `,
    {
        replacements: { person_id: person_id,dateVisiting:dateVisiting},
 
    type: Sequelize.SELECT 
    });    
    return persons[0];
}
async function checkPersonFree(person_id,dat_visiting,start_time,end_time){
let arrVisiting=[];
let res;
  const result= await getPersonFree(person_id,dat_visiting,start_time,end_time)
    .then(result=>result.forEach(item=>{
        arrVisiting.push({
          "start_time":item.start_time,
          "end_time":item.end_time
        });       
    }))

    //console.log(arrVisiting);
    if(arrVisiting.length==0)//якщо немає записів у персон
    {
      console.log("ZERO");
      res=true;
    }
    else{
      res=putToTimeRange(arrVisiting,start_time,end_time);
    }
    
    //console.log(res);
    
return res;

}
//

async function getScheduleFree(schedule_id,date_visiting,start_time,end_time){  
    let dateVisiting=(new Date(date_visiting));
    //console.log(dateVisiting);
    
        schedule=await sequelize.sequelize.query(`Select * From "time_slots" where "schedule_id"=:scheduleId
         AND "date_visiting"=:dateVisiting 
         order by start_time   
        `,
        {
            replacements: { scheduleId: schedule_id,dateVisiting:dateVisiting},
     
        type: Sequelize.SELECT 
        }); 
        //console.log("OK",schedule[0]); 
        return schedule[0];
    }

    async function checkScheduleFree(schedule_id,dat_visiting,start_time,end_time){
        let arrVisiting=[];
        let res=true;
          const result= await getScheduleFree(schedule_id,dat_visiting,start_time,end_time)
            .then(result=>result.forEach(item=>{
                arrVisiting.push({
                  "start_time":item.start_time,
                  "end_time":item.end_time
                });       
            }))
            if(arrVisiting.length==0){
              res=true;
            }
            else{
              res=putToTimeRange(arrVisiting,start_time,end_time);
            }
            
            //console.log(res);
            
        return res;
        
        }

////

/////
async function getTimeSlotByDoctorDate(doctor_id,date_visiting){
  console.log("!!!", sequelize);
//const lastName=req.params.lastName;
//const doctorId=1;
const doctorId=doctor_id;
let dateVis=(new Date(date_visiting))
// stringValue + "+0000"
//let dateVis=(new Date("2020-10-09"))
//let dateVisiting= (new Date(dateVis.getTime() - dateVis.getTimezoneOffset() * 720000).toISOString()); 
let dateVisiting=dateVis.toISOString();
console.log(dateVisiting);
//const dateVisiting=new Date("2020-03-02T22:00:00.000Z");
doctors=await sequelize.sequelize.query(` SELECT "timeSlot"."start_time" AS "start_time", 
"timeSlot"."end_time" AS "end_time", "timeSlot"."date_visiting" AS "date_visiting",
"workPlace"."doctor_id" AS "doctor_id"
 FROM "time_slots" AS "timeSlot" INNER JOIN "schedules" AS "schedule"
 ON "timeSlot"."schedule_id" = "schedule"."id" INNER JOIN 
 "work_places" AS "workPlace" ON "schedule"."work_place_id" = "workPlace"."id" 
WHERE "workPlace"."doctor_id"=:doctor_id AND "timeSlot"."date_visiting"=:date_visiting`,
{
  replacements: { doctor_id: doctorId,date_visiting:dateVisiting},
  //replacements: { doctor_id: doctorId},
  type: Sequelize.SELECT 
});
return doctors[0];

}
router.get('/', async (req, res) => {
  if (req.query.doctorId&&req.query.dateVisiting){
    let doctorId=req.query.doctorId;
    let dateVisiting=req.query.dateVisiting;
    getTimeSlotByDoctorDate(doctorId,dateVisiting)
    .then(result=>res.status(200).send(result));
  }
  
  else {
    const timeSlots = await TimeSlot.findAll({include: [Schedule,Person]});
    res.status(201).send(timeSlots);
  }
    
});

router.post("/", async function (req, res) {         
    if(!req.body) return res.sendStatus(400);
    const start_time=req.body.start_time;
    const end_time=req.body.end_time;
    const date_visiting=req.body.date_visiting;
    const scheduleId=req.body.scheduleId;
    const personId=req.body.personId;
   
    if(start_time>=end_time) 
    {
      console.log("error with time");
      return res.sendStatus(400);
    }
    let freeSchedule=await checkScheduleFree(scheduleId,date_visiting,start_time,end_time);
    console.log( "freeSchedule",freeSchedule);
    let freePerson=await checkPersonFree(personId,date_visiting,start_time,end_time);
    console.log( "freePerson",freePerson);
    let scheduleKeep=await scheduleKeepsStartEnd(scheduleId,start_time,end_time);
    console.log( "scheduleKeep",scheduleKeep);
    if(freeSchedule&&freePerson&&scheduleKeep){
      TimeSlot.create({ //id:id,
                start_time:start_time,
                end_time:end_time,
                date_visiting:date_visiting,
                scheduleId:scheduleId,
                personId:personId
                            }       
                             ).then((result)=>{                    
                              res.status(201).send(res.json(result));
            }).catch(err=>console.log(err));
          }
          else{
            formError={}
            if(!freePerson){
              formError.freePerson="this person is busy";
            }
            if(!freeSchedule){
              formError.freeSchedule="this schedule is busy";
            }

              console.log("error with data");
              return res.status(409).send(JSON.stringify(formError));
    }
 //console.log ("keep",await scheduleKeepsStartEnd(scheduleId,start_time,end_time)) 
    //getScheduleById(scheduleId);
//     if(await checkPersonFree(personId,date_visiting,start_time,end_time))
//     {
//     // &&scheduleKeepsStartEnd(scheduleId,start_time,end_time)&&
//     // freePlacesOnThisTime(scheduleId,date_visiting,start_time,end_time)){
//     TimeSlot.create({ //id:id,
//         start_time:start_time,
//         end_time:end_time,
//         date_visiting:date_visiting,
//         scheduleId:scheduleId,
//         personId:personId
//                     }       
//                      ).then((result)=>{                    
//                       res.status(201).send(res.json(result));
//     }).catch(err=>console.log(err));
//   }
//   else{
//       console.log("error with data");
//       return res.sendStatus(400);
//   }
});
router.get( "/:id", async function(req, res){
    if(!req.params.id)return res.sendStatus(200);  
    TimeSlot.findByPk(req.params.id,{include: [Schedule]}).then( (result) => res.json(result))
 } );

router.put( "/:id", (req, res) =>
    TimeSlot.update({
        start_time:req.body.start_time,
        end_time:req.body.end_time,
        date_visiting:req.body.date_visiting,
        scheduleId:req.body.scheduleId,
        personId:req.body.personId
    },
    {
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
  );
router.delete("/:id",(req,res)=>{    
    TimeSlot.destroy({
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
});

router.get('/:id/byTimeSlot/',async(req,res)=>{
  const doctorId=req.params.id;
  if (req.query.date){
    let dateVisiting=new Date(req.query.date);
    dateVisiting=dateVisiting.toISOString();
    await getTimeslotByDoctorIdAndDate(doctorId,dateVisiting)
    .then(result=>res.status(200).send(result));
  }
  else{
    await getTimeslotByDoctorId(doctorId)
    .then(result=>res.status(200).send(result));
  }
//let dateVisiting=new Date(req.query.date);

 
});
// router.get('/:id/byTimeSlot/',async(req,res)=>{
  
//   let dateVisiting=new Date(req.query.date);
//   const doctorId=req.params.id;
//    dateVisiting=dateVisiting.toISOString();
//   await getTimeslotByDoctorIdAndDate(doctorId,dateVisiting)
//   .then(result=>res.status(200).send(result));
//   });

module.exports = router;