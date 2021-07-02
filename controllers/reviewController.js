const router = require('express').Router();
const {PetModel, UserModel, ReviewModel} = require('../models');
const middleware = require("../middleware");

/*
=================
?CREATE REVIEW
=================
 */
router.post('/create/', middleware.validateSession, async (req, res) =>{

    const{date, rating, comments, petId} = req.body.review;
    const {id} = req.user;
    try{
        await ReviewModel.create({
            date: date,
            rating:rating,
            comments: comments,
            petId: petId,
            userId: id
        })
        .then(
            review => {
                res.status(201).json({
                    review : review,
                    message: 'Review created!'
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `Failed to create review: ${err}`
        });
    };
});
/*

/*
=========================
? GET ALL REVIEWS MADE BY ME
=========================
*/
router.get("/myReviews", middleware.validateSession, async(req, res) => {
    let {id} = req.user;
    try{
        const userReviews = await ReviewModel.findAll({
            where:{
                userId: id
            },
            include: [
                {
                model: PetModel, 
                }]
        });
        res.status(200).json(userReviews);
    } catch (err) {
        res.status(500).json({ 
            message: "Unable to retrieve reviews",
            error: err });
    }
});


/*
==========================
? UPDATE REVIEW MADE BY ME
==========================
*/

router.put("/update/:reviewId", middleware.validateSession , async (req, res) => {
    const { date, rating, comments } = req.body.review;
    const reviewId = req.params.reviewId;
    const userId = req.user.id;

    const query = {
        where: {
            id: reviewId,
            userId: userId
        }
    };

    const updatedReview = {
        date, rating, comments
    };

    try {
        const update = await ReviewModel.update(updatedReview, query);
        res.status(200).json({
            message: 'Review Updated',
            update});
        } catch (err) {
        res.status(500).json({
        message:`Review Failed to Update: ${err}`
    })
    }
});



/*
==================
? DELETE MY REVIEW
==================
*/
router.delete("/delete/myReview/:id", middleware.validateSession, async(req, res) =>{
    const reviewId = req.params.id;
    const userId = req.user.id;

    try {
        const reviewDeleted = await ReviewModel.destroy({
            where: {id: reviewId, userId:userId }
        })
        res.status(200).json({
            message: "Review deleted",
            reviewDeleted
        })

    }catch (err) {
        res.status(500).json({
            message: `Failed to delete review: ${err}`
        })
    }
})

/*
==============================
!GET ALL REVIEWS PROTECTED ROUTE
==============================
*/
router.get('/admin/getall', middleware.validateAdmin, async (req, res) =>{
    try{
        const reviews = await ReviewModel.findAll({
            include:[
                {
                model: PetModel, 
                }]
            });
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({error: err});
    }
});


/*
==============================
!DELETE ANY REVIEW PROTECTED ROUTE
==============================
*/

router.delete("/admin/delete/:id", middleware.validateAdmin, async(req, res) =>{
    const reviewId = req.params.id;
    try {
        const reviewDeleted = await ReviewModel.destroy({
            where: {id: reviewId }
        })
        res.status(200).json({
            message: "Review deleted",
            reviewDeleted
        })

    }catch (err) {
        res.status(500).json({
            message: `Failed to delete review: ${err}`
        })
    }
})



module.exports = router;