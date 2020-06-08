const express=require('express');
const auth =require('../../middelware/auth');
const  User=require('../../Models/User');
const  Profile=require('../../Models/Profile');
const Post =require('../../Models/Post');
const {check,validationResult} =require('express-validator');

const router=express.Router()

// @route POST api/posts
// @desc Create a post
// @access private
router.post('/',[auth,
check('text','Text is required').not().isEmpty()

],async(req,res)=>{

    const errors =validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try {

        const user = await User.findById(req.user.id).select('-password');
        
        const newPost = new Post({
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
    
        });

        const post = await  newPost.save();

        res.json(post);
        
    } catch (err) {
        console.error(err.msg);
        res.status(500).send('server error')
    }

   


});


// @route GET api/posts
// @desc Get all post
// @access private


router.get('/',auth,async (req,res)=>{
        try {

            const posts = await Post.find().sort({data:-1})

            res.json(posts);
            
        } catch (err) {
            console.error(err.msg);
            res.status(500).send('server error')
        }
})



// @route GET api/posts
// @desc Get post by id
// @access private


router.get('/:id',auth,async (req,res)=>{
    try {

        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg:'Post not found'})
        }

        res.json(post);
        
    } catch (err) {
        if(err.kind==='ObjectId'){

            return res.status(404).json({msg:'Post not found'})
        }
        res.status(500).send('server error')
    }
})


// @route delete api/posts
// @desc delete post by id
// @access private



router.delete('/:id',auth,async (req,res)=>{
    try {

        const post = await Post.findById(req.params.id);

        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg:'USer not authorized'});


        }

        await post.remove();

        res.json({msg:"post removed"});
        
    } catch (err) {
        if(err.kind==='ObjectId'){

            return res.status(404).json({msg:'Post not found'})
        }
        res.status(500).send('server error')
    }
})


module.exports =router;