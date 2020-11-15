const express = require('express');
const WorkPlace = require('../models/WorkPlace');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Person = require('../models/Person');

const router = express.Router();


router.get('/', async (req, res) => {
    const workPlaces = await WorkPlace.findAll({include: [Hospital, Doctor]});
    res.status(201).send(workPlaces);
});
router.post("/", async function (req, res) {         
    if(!req.body) return res.sendStatus(400);
    const cabinet_number = req.body.cabinet_number;
    const hospitalId=req.body.hospitalId;
    const doctorId=req.body.doctorId;
    WorkPlace.create({ //id:id,
                    cabinet_number:cabinet_number,
                    hospitalId:hospitalId,
                    doctorId:doctorId
                    }       
                     ).then((result)=>{                    
                      res.status(201).send(res.json(result));
    }).catch(err=>console.log(err));
});
router.get( "/:id", async function(req, res){
    if(!req.params.id)return res.sendStatus(200);    
    WorkPlace.findByPk(req.params.id,{include: [Hospital, Doctor]}).then( (result) => res.json(result))
 } );

router.put( "/:id", (req, res) =>
    WorkPlace.update({
        cabinet_number:req.body.cabinet_number,
        hospitalId:req.body.hospitalId,
        doctorId:req.body.doctorId
    },
    {
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
  );
router.delete("/:id",(req,res)=>{
    
    WorkPlace.destroy({
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
});

router.get('/byDoctorId/:id', async (req, res) => {
  const id=req.params.id;
  if(!id) return res.sendStatus(400);
  const workPlaces = await WorkPlace.findAll({
      where:{
        doctorId:req.params.id
      },   
      include: [Hospital, Doctor],
      
  });
  res.status(201).send(workPlaces);
});

module.exports = router;