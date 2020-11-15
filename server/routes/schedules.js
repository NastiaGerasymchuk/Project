const express = require('express');
const WorkPlace = require('../models/WorkPlace');
const Schedule = require('../models/Schedule');

const router = express.Router();


router.get('/', async (req, res) => {
    const schedules = await Schedule.findAll({include: [WorkPlace]});
    res.status(201).send(schedules);
});
router.post("/", async function (req, res) {         
    if(!req.body) return res.sendStatus(400);
    
    const start_time=req.body.start_time;
    const end_time=req.body.end_time;
    const day_of_week=req.body.day_of_week;
    const workPlaceId=req.body.workPlaceId;
    if(start_time>=end_time) 
    {
      console.log("error with time");
      return res.sendStatus(400);
    }
    Schedule.create({ //id:id,
                    start_time:start_time,
                    end_time:end_time,
                    day_of_week:day_of_week,
                    workPlaceId:workPlaceId
                    }       
                     ).then((result)=>{                    
                      res.status(201).send(res.json(result));
    }).catch(err=>console.log(err));
});
router.get( "/:id", async function(req, res){
    if(!req.params.id)return res.sendStatus(200);    
    Schedule.findByPk(req.params.id,{include: [WorkPlace]}).then( (result) => res.json(result))
 } );

router.put( "/:id", (req, res) =>
    Schedule.update({
        start_time:req.body.start_time,
        end_time:req.body.end_time,
        day_of_week:req.body.day_of_week,
        workPlaceId:req.body.workPlaceId,
    },
    {
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
  );
router.delete("/:id",(req,res)=>{
    
    Schedule.destroy({
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
});

module.exports = router;