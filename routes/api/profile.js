const express = require('express');
const auth = require('../../middelware/auth');
const Profile = require('../../Models/Profile');
const User = require('../../Models/User');
const Post = require('../../Models/Post');

const { check, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');
const router = express.Router();

// @route GET api/profile/me
// @desc Get current users profile
// @access private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'there is no profile for this user' });
    }

    return res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('server error');
  }
});

// @route POST api/profile
// @desc create or update user profile
// @access private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'status is required').not().isEmpty(),
      check('skills', 'skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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
      facebook,
    } = req.body;

    const profileFields = {};

    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    // build social object
    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Errors');
    }

    console.log(profileFields.skills);
  }
);

// @route GEt api/profile
// @desc get all profiles
// @access public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// @route GEt api/profile/user_id
// @desc get profile by user id
// @access public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'profile not found' });

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'profile not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route delete api/profile/user_id
// @desc get delete profile by user id
// @access private

router.delete('/', auth, async (req, res) => {
  try {
    //remove user posts
    await Post.deleteMany({ user: req.user.id });
    //remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'user delted' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// @route PUT api/profile/experience
// @desc add profile experience
// @access private

router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'title is required').not().isEmpty(),
      check('company', 'company is required').not().isEmpty(),
      check('from', 'from date  is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Errro');
    }
  }
);

// @route PUT api/profile/experience
// @desc add profile experience
// @access private
router.delete('/experience/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Errror');
  }
});

// @route PUT api/profile/education
// @desc add profile education
// @access private

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'Schol is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'field of study   is required').not().isEmpty(),
      check('from', 'from data is require').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newedu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newedu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Errror');
    }
  }
);

// @route Delete api/profile/education
// @desc delete profile education
// @access private

router.delete('/education/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.id);

    profile.education.splice(removeIndex, 1);

    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Errror');
  }
});

// @route Get api/profile/github
// @desc Get user repos form Github
// @access public

router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=
            ${config.get('githubClientID')}&client_secret=${config.get(
        'githubSecret'
      )}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No github profile found' });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Errror');
  }
});

module.exports = router;
