const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const config = require('../config/production.json');

exports.customerCreate = async (req, res) => {
  //  parameter guard
  const numOfParams = Object.keys(req.body).length;
  if (numOfParams > 1) {
    return res
      .status(400)
      .json({ errors: [{ msg: 'Bad Request, too many parameters.' }] });
  }

  const userSub = req.userSub;
  try {
    //  Check if the user already exists
    let user = await User.findById(req.userId);

    if (user) {
      return res.status(400).json({
        errors: [{ msg: `User already exists, please sign in.` }],
      });
    }

    const email = req.body.email;
    const emailPrefix = email.subString(0, email.indexOf('@'));

    //  Check if the email is used as a existing username
    const isUsernameExists = await User.findOne({ userName: emailPrefix });
    const defaultUserName = isUsernameExists
      ? emailPrefix + userSub
      : emailPrefix;

    //  Create a new user and save to database
    user = new User({
      userId: userSub,
      userName: defaultUserName,
      email,
      createdTime: new Date().toISOString(),
    });

    await user.save();
    res.status(200).json({ message: 'User created successfully.', user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.validateCustomerSignUp = [
  body('email').exists().withMessage('Email is required'),
  body('password').exists().withMessage('Password is required'),
  body('passwordConfirm').exists().withMessage('Confirm password is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('password needs to be 8 to 16 characters'),
  body('passwordConfirm')
    .custom((value, { req }) => value == req.body.password)
    .withMessage('Password does not match with confirm password'),
];

exports.customerSignUp = async (req, res) => {
  //  Pre-check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Parameter guard
  const numOfParams = Object.keys(req.body).length;
  if (numOfParams != 3) {
    return res
      .status(400)
      .json({ errors: [{ msg: 'Bad Request: params should be exactly 3' }] });
  }

  const { email, password } = req.body;

  try {
    //  Check is the user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        errors: [{ msg: `Email already registered, please sign in.` }],
      });
    }

    //  Create a new user and save to database
    user = new User({ email, password });

    //  Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    //  Save to the database
    await user.save();

    //  Prepare payload for jwt token
    const payload = { user: { id: user.id } };

    //  Sign and return jwt token
    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpire },
      (err, token) => {
        if (err) throw err;
        res
          .status(200)
          .json({ message: 'User account created successfully.', token });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.validateCustomerSignIn = [
  body('email').exists().withMessage('Email is required'),
  body('password').exists().withMessage('Password is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('password needs to be 8 to 16 characters'),
];

exports.customerSignIn = async (req, res) => {
  //  Pre-check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Parameter guard
  const numOfParams = Object.keys(req.body).length;
  if (numOfParams != 2) {
    return res
      .status(400)
      .json({ errors: [{ msg: 'Bad Request: params should be exactly 2' }] });
  }

  const { email, password } = req.body;

  try {
    //  Check if the user exists
    let user = await User.findOne({ email });
    console.log(email, password, user.password, user.email);

    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: `No user registered by this email.` }] });
    }

    //  Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    //  Prepare payload for jwt token
    const payload = { user: { id: user.id } };

    //  Sign and return jwt token
    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpire },
      (err, token) => {
        if (err) throw err;
        res
          .status(200)
          .json({ message: 'User signed in successfully.', token });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
