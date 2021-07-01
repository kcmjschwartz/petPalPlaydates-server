const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/lib/errors");
const {UserModel} = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/*
===============
REGISTER USER
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
LOGIN USER
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

module.exports = router;