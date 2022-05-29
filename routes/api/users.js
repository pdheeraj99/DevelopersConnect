const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const config = require('config');

// @route POST api/users
// @desc Register User
// @access Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // It will handle here all the validation in the checks
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // See if user exists
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already registered' });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password

      // Creating salt
      const salt = await bcrypt.genSalt(10);

      // hashing password with the salt
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return json web token

      const payload = {
        user: {
          id: user.id,
        },
      };

      // We are encoding payload and sending to client so that whenever the client requests something we can check this payload which will come in the headers and if it is valid we can give him the access
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (error, token) => {
          if (error) {
            throw error;
          }
          res.json({
            token,
          });
        }
      );

      // req.body to access the POST data which the user send
      // console.log(req.body);

      // res.send('User Registered Successfully');
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
