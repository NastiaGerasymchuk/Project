const express = require('express');
//const { Sequelize } = require('sequelize/types');
const { Sequelize } = require('sequelize');
const Person = require('../models/Person');
const Schedule = require('../models/Schedule');
const TimeSlot = require('../models/TimeSlot');

const sequelize = require('../config/database');

const router = express.Router();
////
function putToTimeRange(arrVisiting,start_time,end_time){
  if(arrVisiting.length==0)return false;
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
  
}
/////
async function scheduleKeepsStartEnd(schedule_id,st_time, e_time){
  
  const avail=await Schedule.findAll
    ({
      where:{
        [Sequelize.Op.and]:[
          {id:schedule_id},
          {start_time:{[Op.lte]: st_time}},
          {end_time:{[Op.gte]: e_time}}
        ]
        
      }   
  });
  let res;
  if (error) {
    console.log("err")
    throw error
  }
  if(results.rows.length>0){
      console.log("put");

    res=true;
    console.log(res);
  }
  else{
    console.log("bad");
    res=false;
  }
  return res;
}
//   const avail=await pool.query(`SELECT *
// 	FROM schedule
//   WHERE id_schedule=$1 and start_time<=$2 and end_time>=$3`,
//    [schedule_id,start_time, end_time], (error, results) => {    
//     let res;
//     if (error) {
//       console.log("err")
//       throw error
//     }
//     if(results.rows.length>0){
//         console.log("put");

//       res=true;
//       console.log(res);
//     }
//     else{
//       console.log("bad");
//       res=false;
//     }
      
//   }

//   );
//   console.log("sch");
//   return res;
// }
////////

////
async function checkPersonFree(person_id,dat_visiting,start_time,end_time) {
  const avail=await TimeSlot.findAll
    ({
      where:{
        [Sequelize.Op.and]:[
          {personId:person_id},
          {date_visiting:dat_visiting}
        ],
        order: [
          // Will escape title and validate DESC against a list of valid direction parameters
          ['start_time']
        ]
        
      }   
  });
  
  let timePersonVisiting=results.rows;
  let arrVisiting=[];
  timePersonVisiting.forEach(item=>{
  arrVisiting.push({
    "start_time":item.start_time,
    "end_time":item.end_time
  });                
  });
  
 
  return putToTimeRange(arrVisiting,start_time,end_time);
  }
////
async function freePlacesOnThisTime(schedule_id,dat_visiting,start_time,end_time){
  const avail=await TimeSlot.findAll
    ({
      where:{
        [Sequelize.Op.and]:[
          {scheduleId:schedule_id},
          {date_visiting:dat_visiting}
        ],
        order: [
          // Will escape title and validate DESC against a list of valid direction parameters
          ['start_time']
        ]
        
      }   
  });
  
      
 let arrStartEnd=[];   
     if (error) {
       console.log("err")
       throw error
     }
     let data=results.rows;
     data.forEach(item=>{
       arrStartEnd.push({
         "start_time":item.start_time,
         "end_time":item.end_time
       });
     }); 
  
    
    
    return putToTimeRange(arrStartEnd,start_time,end_time)
   }

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
    if(checkPersonFree(personId,date_visiting,start_time,end_time))
    {
    // &&scheduleKeepsStartEnd(scheduleId,start_time,end_time)&&
    // freePlacesOnThisTime(scheduleId,date_visiting,start_time,end_time)){
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
      console.log("error with data");
      return res.sendStatus(400);
  }
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
router.get('/byTimeSlot/:lastName',async(req,res)=>{
  console.log("!!!", sequelize);
const lastName=req.params.lastName;
const doctorId=1;
// stringValue + "+0000"
let dateVis=(new Date("2020-10-09"))
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
res.status(200).send(doctors[0]);
});

module.exports = router;