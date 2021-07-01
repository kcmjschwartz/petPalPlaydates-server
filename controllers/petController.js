const router = require('express').Router();
const {PetModel, UserModel} = require('../models');
const middleware = require("../middleware");
const Pet = require('../models/pet');
const User = require('../models/user');

/*
===============
* CREATE PET
===============
*/

router.post('/create/', middleware.validateSession, async (req, res) =>{
    const {description, petName, petType} = req.body.pet;
    const {id} = req.user;
    const petEntry = {
        description,
        petName,
        petType,
        userId: id
    }
    try{
        const newPet = await PetModel.create(petEntry);
        res.status(200).json(newPet);
    } catch (err) {
        res.status(500).json({ 
            message: "Unable to create pet",
            error :err })
    }
});

/**
===============
* GET ALL PETS
===============
 */

router.get('/allpets', async (req, res) =>{
    try{
        const entries = await PetModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

/**
============================
* GET ALL PETS With UserInfo
============================
 */
                //1 
router.get('/userInfo', async (req, res) =>{
        try{        
        await PetModel.findAll({ 
            include: [
                {
                model: UserModel, 
                }]
        }).then (pets => {
            console.log(pets);
            res.status(200).json({pets})
        })
        
    } catch (err) {
        res.status(500).json({error: err});
    }
});

/*
====================
* GET PETS BY USER
====================
 */

router.get("/mine/", middleware.validateSession, async(req, res) => {
    let {id} = req.user;
    try{
        const userPets = await PetModel.findAll({
            where:{
                userId: id
            }
        });
        res.status(200).json(userPets);
    } catch (err) {
        res.status(500).json({ 
            message: "Unable to retrieve pets",
            error: err });
    }
});

/*
============================
* GET LOGS BY LOG ID BY USER
============================
Functional but not used.
*/

// router.get("/mine/:id", middleware.validateSession, async(req, res) => {
//     const logId = req.params.id;
//     const userId = req.user.id;
//     try {
//     const results = await LogModel.findAll({
//         where: {
//             id: logId,
//             userId: userId
//         }
//     });
//         res.status(200).json(results);
// } catch (err) {
//     res.status(500).json({
//         message:'Unable to retrieve log',
//         error: err
//     })
// }    
    
// });


/*
=======================
* UPDATE PET By User
=======================
*/
// router.put("/update/:petId", middleware.validateSession , async (req, res) => {
//     const { description, petName, petType } = req.body.log;
//     const petId = req.params.petId;
//     const userId = req.user.id;

//     const query = {
//         where: {
//             id: petId,
//             userId: userId
//         }
//     };

//     const updatedLog = {
//         description, , petName, petType
//     };

//     try {
//         const update = await PetModel.update(updatedPet, query);
//         res.status(200).json(update);
//         console.log(updatedPet);
//     } catch (err) {
//         res.status(500).json({
    //            message:`Pet Failed to Update: ${err}`
//     })
//     }
// });

/*
===============================
*UPDATE ANY PET PROTECTED ROUTE
===============================
*/

// router.put("/adminUpdate/:entryId",  middleware.validateAdmin, async (req, res) => {
//     const { description, petName, petType } = req.body.log;
//     const logId = req.params.entryId;
    
//     const query = {
//         where: {
//             id: logId
//         }
//     };

//     const updatedPet = {
//         description, petName, petType 
//     };

//     try {
//         const updateByAdmin = await PetModel.update(updatedPet, query);
//         res.status(200).json(updateByAdmin);
//         console.log(updatedPet, "Pet Updated.");
//     } catch (err) {
//         res.status(500).json({
    //            message:`Pet Failed to Update: ${err}`
//     })
    //}
// });

/*
=======================
* DELETE PET BY OWNER
=======================
*/
// router.delete("/:id", middleware.validateSession, async(req, res) =>{
//     const petId = req.params.id;
//     const userId = req.user.id;

//     try {
//         const petDeleted = await PetModel.destroy({
//             where: {id: petId, userId:userId }
//         })
//         res.status(200).json({
//             message: "Pet deleted",
//             logDeleted
//         })

//     }catch (err) {
//         res.status(500).json({
//             message: `Failed to delete pet: ${err}`
//         })
//     }
// })

/*
=================================
* DELETE ANY PETS PROTECTED ROUTE
=================================
*/
// router.delete("/admin/delete/:id",  middleware.validateAdmin, async(req, res) =>{
//     const petId = req.params.id;
    
//     try {
//         const petDeleted = await PetModel.destroy({
//             where: {id: petId }
//         })
//         res.status(200).json({
//             message: "Pet deleted",
//             petDeleted
//         })

//     }catch (err) {
//         res.status(500).json({
//             message: `Failed to delete pet: ${err}`
//         })
//     }
// })





module.exports = router;