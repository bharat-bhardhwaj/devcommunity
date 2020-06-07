const express=require('express');
const auth=require('../../middelware/auth');
const User =require('../../Models/User');
const bcrypt=require('bcryptjs');
const JWT =require('jsonwebtoken');
const config =require('config');
const {check,validationResult} =require('express-validator');
const router=express.Router()


// @route GET api/auth
// @desc Test route
// @access public
router.get('/',auth,async ( req,res)=> {
    
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('server error');
    }

});

// @route   GET api/auth
// @desc    Authenticate user & get token
// @access  public
router.post('/',
[
   
    check('email','Please include a valid email').isEmail(),
    check('password','password is required').exists()
]
, async (req,res)=> {

    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {email,password}=req.body;

    try {
        let user=await User.findOne({email});

        //see if user exists

        if(!user){
            return res.status(400).json({errors:[{msg:'Invalid credentials'}]});
        }

        //Encrypt password

      const isMatch =await bcrypt.compare(password,user.password);

      if(!isMatch){
         return res.status(400).json({errors:[{msg:'Invalid credentials'}]});
      }


        const payload ={
            user: {
                id:user.id
            }
        }


        JWT.sign(
            payload,
            config.get("jwtSecret"),
            {expiresIn:3600000},
            (err,token)=>{
                if(err) throw err;

               res.json({token})
            })

        // Return jsonwebtoken
        

    } catch (err) {
        console.log(err.message);
        res.status(500).send('server error');
    }


  
});



module.exports =router;