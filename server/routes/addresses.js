const express = require('express');
const Address = require('../models/Address');

const router = express.Router();


router.get('/', async (req, res) => {
    const addresses = await Address.findAll(
        {
            order: [
                // will return `name`
                ['city_village'],
                // will return `username` DESC
                ['street'],
                ['house_number'],
                ['flat_number']
            ]
        }
    );
    res.status(201).send(addresses);
});



router.post("/", async function (req, res) {         
    if(!req.body) return res.sendStatus(400);
         
     //const id = req.body.id;
    const city_village = req.body.city_village;
    const street=req.body.street;
    const house_number=req.body.house_number;
    const flatNumber=req.body.flatNumber;
    Address.create({ //id:id,
                     city_village: city_village,
                     street:street,
                     house_number:house_number,
                     flatNumber:flatNumber})
            .then((result)=>{
                    
                        res.status(201).send(res.json(result));
    }).catch(err=>console.log(err));
});
router.get( "/:id", async function(req, res){
    if(!req.params.id)return res.sendStatus(200);    
    Address.findByPk(req.params.id).then( (result) => res.json(result))
 } );

router.put( "/:id", (req, res) =>
    Address.update({
        street: req.body.street
    },
    {
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
  );
router.delete("/:id",(req,res)=>{
    
    Address.destroy({
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
});



// router.get('/:id',async(req,res)=>{
//    const id=(req.query.id);
//    console.log(id);
//    const addresses= Address.findAll({
//         where: {
//           id: 2,
//         }
//       });
//       res.status(201).send(JSON.stringify(addresses));
// });


// router.get("/edit/:id", function(req, res){
//     const id = req.params.id;
//     Address.findAll({where:{id: id}})
//     .then(data=>{
//         res.status(200).send(JSON.stringify(results.rows));
//     })
//     .catch(err=>console.log(err));
//   });

module.exports = router;