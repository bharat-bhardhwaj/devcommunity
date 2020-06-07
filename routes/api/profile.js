const express=require('express');
const auth =require('../../middelware/auth');
const  Profile=require('../../Models/Profile');
const  User=require('../../Models/User');
const {check,validationResult} =require('express-validator');
const router=express.Router()

// @route GET api/profile/me
// @desc Get current users profile
// @access private
router.get('/me',auth, async (req,res)=>{
    
    try {

        const profile =await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);

        


        if(!profile){
            return res.status(400).json({msg:'there is no profile for this user'});
        }
        
    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");
    }
});


// @route POST api/profile
// @desc create or update user profile
// @access private

router.post('/',[auth,[
    check('status','status is required').not().isEmpty(),
    check('skills','skills is required').not().isEmpty()
]],async(req,res)=>{

    const errors=validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
      } = req.body;

      const profileFields ={};

      profileFields.user =req.user.id;

      if(company) profileFields.company=company;
      if(website) profileFields.website=website;
      if(location) profileFields.location=location;
      if(bio) profileFields.bio=bio;
      if(status) profileFields.status=status;
      if(githubusername) profileFields.githubusername=githubusername;

      if(skills){
          profileFields.skills =skills.split(',').map(skill =>skill.trim());
      }

      console.log(profileFields.skills)




      res.send('hello');


      

})



module.exports =router;