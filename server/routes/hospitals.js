const express = require('express');
const Hospital = require('../models/Hospital');
const Address = require('../models/Address');

const router = express.Router();


router.get('/', async (req, res) => {
    const hospitals = await Hospital.findAll({include: [Address]});
    res.status(201).send(hospitals);
});

router.post("/", async function (req, res) {         
    if(!req.body) return res.sendStatus(400);
    const name_hosp=req.body.name_hosp;
    const community=req.body.community;
    const addressId=req.body.addressId;
    Hospital.create({
                    name_hosp:name_hosp,
                    community:community, 
                    addressId:addressId                   
                    }       
                     ).then((result)=>{                    
                      res.status(201).send(res.json(result));
    }).catch(err=>console.log(err));
});
router.get( "/:id", async function(req, res){
    if(!req.params.id)return res.sendStatus(200);    
    Hospital.findByPk(req.params.id,{include: [Address]}).then( (result) => res.json(result))
 } );

router.put( "/:id", function(req, res){    
    Hospital.update({
        community:req.body.community
    },
    {
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )}
  );
router.delete("/:id",(req,res)=>{    
    Hospital.destroy({
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
});

module.exports = router;