const router = require('express').Router();
const {PetModel, RequestModel, ReviewModel, UserModel} = require('../models');
const middleware = require("../middleware");


/*
===============
? CREATE PET
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

/*
===============
? GET ALL PETS
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

/*
============================
? GET ALL PETS With UserInfo
============================
 */
                
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
? GET PETS BY USER
====================
 */

router.get("/myPets/", middleware.validateSession, async(req, res) => {
    let {id} = req.user;
    try{
        const userPets = await PetModel.findAll({
            where:{
                userId: id
            },
        });
        res.status(200).json(userPets);
    } catch (err) {
        res.status(500).json({ 
            message: "Unable to retrieve pets",
            error: err });
    }
});


/*
=======================
? UPDATE PET By User
=======================
*/
router.put("/update/:petId", middleware.validateSession , async (req, res) => {
    const { description, petName, petType } = req.body.pet;
    const petId = req.params.petId;
    const userId = req.user.id;

    const query = {
        where: {
            id: petId,
            userId: userId
        }
    };

    const updatedPet = {
        description, petName, petType
    };

    try {
        const update = await PetModel.update(updatedPet, query);
        res.status(200).json({
            message: 'Pet Updated',
            update});
        } catch (err) {
        res.status(500).json({
        message:`Pet Failed to Update: ${err}`
    })
    }
});

/*
===============================
!UPDATE ANY PET PROTECTED ROUTE
===============================
*/

router.put("/admin/update/:petId",  middleware.validateAdmin, async (req, res) => {
    const { description, petName, petType } = req.body.pet;
    const petId = req.params.petId;
    
    const query = {
        where: {
            id: petId
        }
    };

    const updatedPet = {
        description, petName, petType 
    };

    try {
        const updateByAdmin = await PetModel.update(updatedPet, query);
        res.status(200).json({
                message:'Pet Updated',
                updateByAdmin});
      
    } catch (err) {
        res.status(500).json({
               message:`Pet Failed to Update: ${err}`
    })
    }
});

/*
=======================
? DELETE PET BY OWNER
=======================
*/
router.delete("/delete/myPet/:id", middleware.validateSession, async(req, res) =>{
    const petId = req.params.id;
    const userId = req.user.id;

    try {
        const petDeleted = await PetModel.destroy({
            where: {id: petId, userId:userId }
        })
        res.status(200).json({
            message: "Pet deleted",
            petDeleted
        })

    }catch (err) {
        res.status(500).json({
            message: `Failed to delete pet: ${err}`
        })
    }
})

/*
=================================
! DELETE ANY PETS PROTECTED ROUTE
=================================
*/
router.delete("/admin/delete/:id",  middleware.validateAdmin, async(req, res) =>{
    const petId = req.params.id;
    
    try {
        const petDeleted = await PetModel.destroy({
            where: {id: petId }
        })
        res.status(200).json({
            message: "Pet deleted",
            petDeleted
        })

    }catch (err) {
        res.status(500).json({
            message: `Failed to delete pet: ${err}`
        })
    }
})

/*
=====================================
? GET PETS BY USER WITH REQUEST INFO
=====================================
 */
router.get("/myPets/requestInfo/", middleware.validateSession, async(req, res) => {
    let {id} = req.user;
    try{
        const userPets = await PetModel.findAll({
            where:{
                userId: id
            },
            include:[{
                model: RequestModel
            }]
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
* GET PET BY PET ID 
============================

*/

router.get("/selectPet/:id", async(req, res) => {
    const petId = req.params.id;
    
    try {
    const pet = await PetModel.findAll({
        where: {
            id: petId,
                },
                include:[{
                    model: ReviewModel
                }]    
               
    });
        res.status(200).json(pet);
} catch (err) {
    res.status(500).json({
        message:'Unable to retrieve pet',
        error: err
    })
}    
    
});






module.exports = router;