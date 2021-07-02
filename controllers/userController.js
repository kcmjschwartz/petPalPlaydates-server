const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/lib/errors");
const {UserModel} = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const middleware = require("../middleware");

/*
===============
?REGISTER USER
===============
*/
router.post('/register', async (req, res) => {
    let { email, password, firstName, lastName, city, role} = req.body.user;     
    try{
        const User = await UserModel.create({
        email,
        password: bcrypt.hashSync(password, 13),
        firstName,
        lastName,
        city,
        role
    });
    let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60* 24});

    res.status(201).json({
        message: 'User is successfully registered',
        user: User,
        sessionToken: token 
    });
} catch (err) {
    if (err instanceof UniqueConstraintError){
        res.status(409).json({
            message: "This email is already in use.",
        });
    } else {
    res.status(500).json({
        message: "Failed to register user.",
    });
}
}
});


/*
===========
?LOGIN USER
===========
*/

router.post("/login", async (req, res) => {
    let { email, password} = req.body.user;

    try{
        let loginUser=  await UserModel.findOne({
        where: {
            email: email,
        },          
    });

    if (loginUser){
        let passwordComparison = await bcrypt.compare(password, loginUser.password);

        if (passwordComparison){
        let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60* 24});
            res.status(200).json({
                user: loginUser,
                message: "User successfully logged in!",
                sessionToken: token
            });
            }else {        
            res.status(401).json({
            message: "Incorrect email or password"
        })
        }

    }else {        
        res.status(401).json({
        message: "Incorrect email or password"
    });
    }
    }catch (error) {
        res.status(500).json({
            message: "Failed to log user in"
        })
    }
});

/*
==============================
!GET ALL USERS PROTECTED ROUTE
==============================
*/
router.get('/admin/getall', middleware.validateAdmin, async (req, res) =>{
    try{
        const entries = await UserModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({error: err});
    }
});




/*
=================================
!UPDATE USER ROLE PROTECTED ROUTE
=================================
*/

router.put("/admin/update/:id", middleware.validateAdmin, async(req, res) =>{
    let {role} = req.body.user;
    const updateUser = { role: role };
    const query = { where: {
        id: req.params.id
    }};
    try{
        const foundUser = await UserModel.findOne(query);
        if (foundUser){
            await UserModel.update(updateUser, query);
            res.status(201).json({ UpdatedUser: updateUser });
        } else {
            res.status(406).json({
                message:'User not found.'
            })
        }
    } catch (err){
        res.status(500).json({error:err})
    }

});




/*
==============================
!DELETE USER PROTECTED ROUTE
==============================
*/

router.delete("/admin/delete/:id", middleware.validateAdmin, async(req, res) =>{
    
    try {
        const userDeleted = await UserModel.destroy({
            where: {id: req.params.id}
        })
        res.status(200).json({
            message: "User deleted",
            userDeleted
        })

    }catch (err) {
        res.status(500).json({
            message: `Failed to delete user: ${err}`
        })
    }
})



module.exports = router;