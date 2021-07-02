const router = require('express').Router();
const {PetModel, UserModel, RequestModel} = require('../models');
const middleware = require("../middleware");
const models = require('../models');


/*
=================
? CREATE REQUEST
=================
 */
router.post('/create/', middleware.validateSession, async (req, res) =>{

    const{status, wayToContact, comments, petId} = req.body.request;
    const {id} = req.user;
    try{
        await RequestModel.create({
            status: status,
            wayToContact: wayToContact,
            comments: comments,
            petId: petId,
            userId: id
        })
        .then(
            request => {
                res.status(201).json({
                    request : request,
                    message: 'Request created!'
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `Failed to create request: ${err}`
        });
    };
});
/*

/*
=========================
? GET REQUESTS MADE BY ME
=========================
*/
router.get("/myRequests/", middleware.validateSession, async(req, res) => {
    let {id} = req.user;
    try{
        const userRequests = await RequestModel.findAll({
            where:{
                userId: id
            },
            include: [
                {
                model: PetModel, 
                }]
        });
        res.status(200).json(userRequests);
    } catch (err) {
        res.status(500).json({ 
            message: "Unable to retrieve requests",
            error: err });
    }
});


/*
==========================
? UPDATE REQUEST MADE BY ME
==========================
*/

router.put("/update/:requestId", middleware.validateSession , async (req, res) => {
    const { status, wayToContact, comments } = req.body.request;
    const requestId = req.params.requestId;
    const userId = req.user.id;

    const query = {
        where: {
            id: requestId,
            userId: userId
        }
    };

    const updatedRequest = {
        status, wayToContact, comments
    };

    try {
        const update = await RequestModel.update(updatedRequest, query);
        res.status(200).json({
            message: 'Request Updated',
            update});
        } catch (err) {
        res.status(500).json({
        message:`Request Failed to Update: ${err}`
    })
    }
});



/*
===========================
UPDATE REQUEST FOR MY PETS
===========================
*/

// router.put("/update/:requestId", middleware.validateSession , async (req, res) => {
//     const { status, wayToContact, comments } = req.body.request;
//     const requestId = req.params.requestId;
//     const userId = req.user.id;

//     const query = {
//         where: {
//             id: requestId,
//             userId: userId
//         }
//     };

//     const updatedRequest = {
//         status, wayToContact, comments
//     };

//     try {
//         const update = await RequestModel.update(updatedRequest, query);
//         res.status(200).json({
//             message: 'Request Updated',
//             update});
//         } catch (err) {
//         res.status(500).json({
//         message:`Request Failed to Update: ${err}`
//     })
//     }
// });






/*
==================
?DELETE MY REQUEST
==================
*/
router.delete("/delete/myRequest/:id", middleware.validateSession, async(req, res) =>{
    const requestId = req.params.id;
    const userId = req.user.id;

    try {
        const requestDeleted = await RequestModel.destroy({
            where: {id: requestId, userId:userId }
        })
        res.status(200).json({
            message: "Request deleted",
            requestDeleted
        })

    }catch (err) {
        res.status(500).json({
            message: `Failed to delete request: ${err}`
        })
    }
})





module.exports = router;