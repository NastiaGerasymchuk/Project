const express = require('express');
const Doctor = require('../models/Doctor');
const Person = require('../models/Person');
const JobTiltle = require('../models/JobTitle');
// const { Sequelize } = require('sequelize/types');
const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const router = express.Router();

// const sequelize = new Sequelize('helsi', 'postgres', '6116', {
//   host: "23.251.131.44",
//   dialect: 'postgres',

//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   },


//   // SQLite only
//   //storage: 'path/to/database.sqlite',

//   // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
//   operatorsAliases: true
// });

const db = sequelize.sequelize;


async function getDoctorByName(lastName){
  doctors=await sequelize.sequelize.query(`SELECT "doctors"."id", "doctors"."person_id" 
    AS "personId", "doctors"."job_title_id" AS "jobTitleId", "person"."id" AS 
    "personId", "person"."first_name" AS "first_name", "person"."last_name"
    AS "last_name", "person"."middle_name" AS "middle_name",
    "person"."date_born" AS "date_born", "person"."phone_number"
    AS "phone_number", "person"."email" AS "email",
    "person"."pass" AS "pass", "person"."address_id" AS "addressId",
    "person"."role" AS "role", "job_title"."id" AS "job_titleId", "job_title"."title"
    AS "job_titleTitle" FROM "doctors" AS "doctors" LEFT OUTER JOIN "persons" AS "person" ON
    "doctors"."person_id" = "person"."id" LEFT OUTER JOIN "job_titles" AS "job_title" ON "doctors"."job_title_id" = "job_title"."id" 
    WHERE "person"."last_name" LIKE ? ORDER BY last_name, first_name, job_title`,
    {
      replacements: [`%${lastName}%`],
      type: Sequelize.SELECT 
    });
    return doctors[0];
}

async function getDoctorByJob(job){
  doctors=await sequelize.sequelize.query(`SELECT "doctors"."id", "doctors"."person_id" 
  AS "personId", "doctors"."job_title_id" AS "jobTitleId", "person"."id" AS 
  "personId", "person"."first_name" AS "first_name", "person"."last_name"
  AS "last_name", "person"."middle_name" AS "middle_name",
  "person"."date_born" AS "date_born", "person"."phone_number"
  AS "phone_number", "person"."email" AS "email",
  "person"."pass" AS "pass", "person"."address_id" AS "addressId",
  "person"."role" AS "role", "job_title"."id" AS "job_titleId", "job_title"."title"
  AS "job_titleTitle" FROM "doctors" AS "doctors" LEFT OUTER JOIN "persons" AS "person" ON
  "doctors"."person_id" = "person"."id" LEFT OUTER JOIN "job_titles" AS "job_title" ON "doctors"."job_title_id" = "job_title"."id" 
 
  WHERE "job_title"."title" LIKE ? ORDER BY last_name, first_name, job_title`,
  {
    replacements: [`%${job}%`],
    type: Sequelize.SELECT 
  });
  return doctors[0];
}
async function getDoctorByCommunity(community){  
  doctors=await sequelize.sequelize.query(`Select doctor_id
  from hospitals inner join work_places on
  hospitals.id=hospital_id
  where community=?
  GROUP BY doctor_id
  ORDER BY doctor_id`,
  {
    replacements: [`${community}`],
    type: Sequelize.SELECT 
  });
  console.log(doctors[0])
  return doctors[0];
}
async function getDoctorByDistrict(district){
  
    doctors=await sequelize.sequelize.query(`SELECT "doctor_id" 
    FROM "persons" INNER JOIN "addresses" ON "persons"."address_id"="addresses"."id"
    WHERE "addresses"."city_village" LIKE ? AND "doctor_id">0
    GROUP BY "doctor_id"`,
    {
      replacements: [`%${district}%`],
      type: Sequelize.SELECT 
    });
   return doctors[0];
  
}

router.get('/', async (req, res) => {
  if (req.query.name){
    getDoctorByName(req.query.name)
    .then(result=>res.status(200).send(result));
  }
  else if (req.query.job){
    getDoctorByJob(req.query.job)
    .then(result=>res.status(200).send(result));
  }
  else if (req.query.community){
    getDoctorByCommunity(req.query.community)
   .then(result=>res.status(200).send(result)); 
    
  }
  else if(req.query.district){
    getDoctorByDistrict(req.query.district)
    .then(result=>res.status(200).send(result)); 
  }
  else {
    const doctors = await Doctor.findAll({include: [Person, JobTiltle]});
    res.status(200).send(doctors);
  }
  }
    
);


router.post("/", async function (req, res) {         
    if(!req.body) return res.sendStatus(400);
    const personId=req.body.personId;
    const jobTitleId=req.body.jobTitleId;
    Doctor.create({ //id:id,
                    personId:personId,
                    jobTitleId:jobTitleId,                    
                    }       
                     ).then((result)=>{                    
                      res.status(201).send(res.json(result));
    }).catch(err=>console.log(err));
});
router.get( "/:id", async function(req, res){
    if(!req.params.id)return res.sendStatus(200);    
    Doctor.findByPk(req.params.id,{include: [Person, JobTiltle]}).then( (result) => res.json(result))
 } );

router.put( "/:id", function(req, res){  
    console.log(req.params.id) ;
    Doctor.update({
        //personId:personId,
        jobTitleId:req.body.jobTitleId 
    },
    {
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )}
  );
router.delete("/:id",(req,res)=>{    
    Doctor.destroy({
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
});
router.get('/byJobId/:id', async (req, res) => {
  const id=req.params.id;
  if(!id) return res.sendStatus(400);
  const doctors = await Doctor.findAll({
      where:{
        jobTitleId:req.params.id
      },   
      include: [Person, JobTiltle],
      
  });
  res.status(201).send(doctors);
});
router.get('/byPersonId/:id', async (req, res) => {
  const id=req.params.id;
  if(!id) return res.sendStatus(400);
  const doctors = await Doctor.findAll({
      where:{
        personId:req.params.id
      },   
      include: [Person, JobTiltle],
      
  });
  res.status(201).send(doctors);
});
router.get('/byLastName/:lastName',async(req,res)=>{
  console.log("!!!", sequelize);
const lastName=req.params.lastName;
doctors=await sequelize.sequelize.query(`SELECT "doctors"."id", "doctors"."person_id" 
AS "personId", "doctors"."job_title_id" AS "jobTitleId", "person"."id" AS 
"personId", "person"."first_name" AS "first_name", "person"."last_name"
AS "last_name", "person"."middle_name" AS "middle_name",
"person"."date_born" AS "date_born", "person"."phone_number"
AS "phone_number", "person"."email" AS "email",
"person"."pass" AS "pass", "person"."address_id" AS "addressId",
"person"."role" AS "role", "job_title"."id" AS "job_titleId", "job_title"."title"
AS "job_titleTitle" FROM "doctors" AS "doctors" LEFT OUTER JOIN "persons" AS "person" ON
"doctors"."person_id" = "person"."id" LEFT OUTER JOIN "job_titles" AS "job_title" ON "doctors"."job_title_id" = "job_title"."id" 
WHERE "person"."last_name" LIKE ? ORDER BY last_name, first_name, job_title`,
{
  replacements: [`%${lastName}%`],
  type: Sequelize.SELECT 
});
res.status(201).send(doctors[0]);
});
// router.get('/byLastName/:lastName',async(req,res)=>{
//   console.log("!!!", sequelize);
// const lastName=req.params.lastName;
// doctors=await sequelize.sequelize.query(`SELECT "doctors"."id", "doctors"."person_id" 
// AS "personId", "doctors"."job_title_id" AS "jobTitleId", "person"."id" AS 
// "person.id", "person"."first_name" AS "person.first_name", "person"."last_name"
// AS "person.last_name", "person"."middle_name" AS "person.middle_name",
// "person"."date_born" AS "person.date_born", "person"."phone_number"
// AS "person.phone_number", "person"."email" AS "person.email",
// "person"."pass" AS "person.pass", "person"."address_id" AS "person.addressId",
// "person"."role" AS "person.role", "job_title"."id" AS "job_title.id", "job_title"."title"
// AS "job_title.title" FROM "doctors" AS "doctors" LEFT OUTER JOIN "persons" AS "person" ON
// "doctors"."person_id" = "person"."id" LEFT OUTER JOIN "job_titles" AS "job_title" ON "doctors"."job_title_id" = "job_title"."id" 
// WHERE "person"."last_name" LIKE ?`,
// {
//   replacements: [lastName],
//   type: Sequelize.SELECT 
// });
// res.status(201).send(doctors[0]);
// });
router.get('/byJobTitle/:jobTitle',async(req,res)=>{
  const jobTitle=req.params.jobTitle;
  doctors=await sequelize.sequelize.query(`SELECT "doctors"."id", "doctors"."person_id" 
  AS "personId", "doctors"."job_title_id" AS "jobTitleId", "person"."id" AS 
  "personId", "person"."first_name" AS "first_name", "person"."last_name"
  AS "last_name", "person"."middle_name" AS "middle_name",
  "person"."date_born" AS "date_born", "person"."phone_number"
  AS "phone_number", "person"."email" AS "email",
  "person"."pass" AS "pass", "person"."address_id" AS "addressId",
  "person"."role" AS "role", "job_title"."id" AS "job_titleId", "job_title"."title"
  AS "job_titleTitle" FROM "doctors" AS "doctors" LEFT OUTER JOIN "persons" AS "person" ON
  "doctors"."person_id" = "person"."id" LEFT OUTER JOIN "job_titles" AS "job_title" ON "doctors"."job_title_id" = "job_title"."id" 
 
  WHERE "job_title"."title" LIKE ? ORDER BY last_name, first_name, job_title`,
  {
    replacements: [`%${jobTitle}%`],
    type: Sequelize.SELECT 
  });
  res.status(201).send(doctors[0]);
  });
  router.get('/byAddressPerson/:city_village',async(req,res)=>{
    const city_village=req.params.city_village;
    doctors=await sequelize.sequelize.query(`SELECT "doctor_id" 
    FROM "persons" INNER JOIN "addresses" ON "persons"."address_id"="addresses"."id"
    WHERE "addresses"."city_village" LIKE ? AND "doctor_id">0
    GROUP BY "doctor_id"`,
    {
      replacements: [`%${city_village}%`],
      type: Sequelize.SELECT 
    });
    res.status(201).send(doctors[0]);
  });
    // GROUP by "doctor_id"
    
    
   
    // WHERE "job_title"."title" LIKE ? ORDER BY last_name, first_name, job_title`,
    // {
    //   replacements: [`%${jobTitle}%`],
    //   type: Sequelize.SELECT 
    // });
   // );
   
    // router.get('/byCommunity/:community',async(req,res)=>{
    //   const community=req.params.community;
      // doctors=await sequelize.sequelize.query(`Select doctor_id
      // from hospitals inner join work_places on
      // hospitals.id=hospital_id
      // where community=?
      // GROUP BY doctor_id
      // ORDER BY doctor_id`,
      // {
      //   replacements: [`${community}`],
      //   type: Sequelize.SELECT 
      // });
      //getDoctorByCommunity(community).then(result=>res.status(200).send(result));
      //res.status(200).send(getDoctorByCommunity(community))
      //});

      
      // GROUP by "doctor_id"
      
      
     
      // WHERE "job_title"."title" LIKE ? ORDER BY last_name, first_name, job_title`,
      // {
      //   replacements: [`%${jobTitle}%`],
      //   type: Sequelize.SELECT 
      // });
     // );
      
  // select doctor_id
// from persons inner join addresses on addresses.id=address_id
// where city_village LIKE 'Khotyn' AND doctor_id >1
// Group by doctor_id
  // doctors=await sequelize.sequelize.query(`SELECT "doctors"."id", "doctors"."person_id" 
  // AS "personId", "doctors"."job_title_id" AS "jobTitleId", "person"."id" AS 
  // "person.id", "person"."first_name" AS "person.first_name", "person"."last_name"
  // AS "person.last_name", "person"."middle_name" AS "person.middle_name",
  // "person"."date_born" AS "person.date_born", "person"."phone_number"
  // AS "person.phone_number", "person"."email" AS "person.email",
  // "person"."pass" AS "person.pass", "person"."address_id" AS "person.addressId",
  // "person"."role" AS "person.role", "job_title"."id" AS "job_title.id", "job_title"."title"
  // AS "job_title.title" FROM "doctors" AS "doctors" LEFT OUTER JOIN "persons" AS "person" ON
  // "doctors"."person_id" = "person"."id" LEFT OUTER JOIN "job_titles" AS "job_title" ON "doctors"."job_title_id" = "job_title"."id" 
  // WHERE "job_title"."title" LIKE ?`,
  
// const users = sequelize.query("SELECT * FROM `persons`", { type: sequelize.Sequelize.SELECT})
// console.log(users);
// });
// cars = await db.sequelize.query('SELECT "id" FROM Cars" WHERE "Cars"."ownerId" = (:id)', {
//   replacements: {id: req.user.id},
//   type: db.sequelize.QueryTypes.SELECT
// });
// Sequelize.query("SELECT * FROM `doctors`", { type: Sequelize.SELECT})
//   .then(doctors => {
//     console.log(doctors)
//     // We don't need spread here, since only the results will be returned for select queries
//   });
// sequelize.query("SELECT * from persons").then(results => {
//   console.log(JSON.stringify(results));
// });

// router.get('/filter/',async(req,res)=>{
//   console.log("!!!", req.query);
//   //let page = req.query.page;
// const lastName=req.query.name;
// doctors=await sequelize.sequelize.query(`SELECT "doctors"."id", "doctors"."person_id" 
// AS "personId", "doctors"."job_title_id" AS "jobTitleId", "person"."id" AS 
// "personId", "person"."first_name" AS "first_name", "person"."last_name"
// AS "last_name", "person"."middle_name" AS "middle_name",
// "person"."date_born" AS "date_born", "person"."phone_number"
// AS "phone_number", "person"."email" AS "email",
// "person"."pass" AS "pass", "person"."address_id" AS "addressId",
// "person"."role" AS "role", "job_title"."id" AS "job_titleId", "job_title"."title"
// AS "job_titleTitle" FROM "doctors" AS "doctors" LEFT OUTER JOIN "persons" AS "person" ON
// "doctors"."person_id" = "person"."id" LEFT OUTER JOIN "job_titles" AS "job_title" ON "doctors"."job_title_id" = "job_title"."id" 
// WHERE "person"."last_name" LIKE ? ORDER BY last_name, first_name, job_title`,
// {
//   replacements: [`%${lastName}%`],
//   type: Sequelize.SELECT 
// });
// res.status(201).send(doctors[0]);
// });



// router.get('/byTimeSlot/:lastName',async(req,res)=>{
//   console.log("!!!", sequelize);
// const lastName=req.params.lastName;
// doctors=await sequelize.sequelize.query(` SELECT "timeSlot"."id", "timeSlot"."start_time", 
// "timeSlot"."end_time", "timeSlot"."date_visiting", "timeSlot"."schedule_id" AS "scheduleId", 
// "timeSlot"."person_id" AS "personId", "schedule"."id" AS "schedule.id", "schedule"."start_time" 
// AS "schedule.start_time", "schedule"."end_time" AS "schedule.end_time", "schedule"."day_of_week" 
// AS "schedule.day_of_week", "schedule"."work_place_id" AS "schedule.workPlaceId", "person"."id" AS
// "person.id", "person"."first_name" AS "person.first_name", "person"."last_name" AS "person.last_name",
// "person"."middle_name" AS "person.middle_name", "person"."date_born" AS "person.date_born", "person"."phone_number" AS
// "person.phone_number", "person"."email" AS "person.email", "person"."pass" AS "person.pass", "person"."address_id" AS "person.addressId",
// "person"."photo" AS "person.photo", "person"."role" AS "person.role","workPlace"."id" AS "workPlaceId",
// "workPlace"."doctor_id" AS "doctor_id"
//  FROM "time_slots" AS "timeSlot" INNER JOIN "schedules" AS "schedule"
//  ON "timeSlot"."schedule_id" = "schedule"."id" INNER  JOIN "persons" AS "person" ON "timeSlot"."person_id" = "person"."id" INNER JOIN 
//  "work_places" AS "workPlace" ON "schedule"."work_place_id" = "workPlace"."id"`) 
// // WHERE "person"."last_name" LIKE ? ORDER BY last_name, first_name, job_title`,
// // {
// //   replacements: [`%${lastName}%`],
// //   type: Sequelize.SELECT 
// // });
// res.status(200).send(doctors[0]);
// });

module.exports = router;