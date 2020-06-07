const express=require('express');
const {check,validationResult} =require('express-validator');
const User =require('../../Models/User');
const bcrypt=require('bcryptjs');

const router=express.Router();
const gravatar=require('gravatar');

// @route GET api/users
// @desc Register user
// @access public
router.post('/',
[
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password','please enter a passwor with 6 or more characters').isLength({min:6})
]
, async (req,res)=> {

    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {name,email,password}=req.body;

    try {
        let user=await User.findOne({email});

        //see if user exists

        if(user){
            res.status(400).json({errors:[{msg:'user already exists'}]});
        }




        //Get users gravatar
        const avatar =gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })


        user =new User({
            name,
            email,
            avatar,
            password
        })

        //Encrypt password

        const salt = await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(password,salt);
        await user.save()

        // Return jsonwebtoken
        res.send('User registered')

    } catch (err) {
        console.log(err.message);
        res.status(500).send('server error');
    }


  
});


module.exports =router;