const express = require('express');
const Job = require('../models/JobTitle');

const router = express.Router();


router.get('/', async (req, res) => {    
    const jobs = await Job.findAll({
        order: [
            // will return `name`
            ['title']  
        ]      
    });
    res.status(201).send(jobs);
});

router.post("/", async function (req, res) {         
    if(!req.body) return res.sendStatus(400);
    const title=req.body.title;
    Job.create({ //id:id,
                    
                     title:title})
                      .then((result)=>{                    
                      res.status(201).send(res.json(result));
    }).catch(err=>console.log(err));
});
router.get( "/:id", async function(req, res){
    if(!req.params.id)return res.sendStatus(200);    
    Job.findByPk(req.params.id).then( (result) => res.json(result))
 } );

router.put( "/:id", async function (req, res) {
    if(!req.params.id)return res.sendStatus(200);  
    Job.update({
        title: req.body.title
    },
    {
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
}
    
  );
router.delete("/:id",function (req,res){
    if(!req.params.id)return res.sendStatus(200);    
    Job.destroy({
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
});


module.exports = router;