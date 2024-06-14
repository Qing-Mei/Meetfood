const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const { isCognitoAuthenticated } = require('../middleware/is-auth');

// Customer Create Based Cognito
router.post('/new', isCognitoAuthenticated, UserController.customerCreate);

// Customer Sign Up
router.post(
  '/signup',
  UserController.validateCustomerSignUp,
  UserController.customerSignUp,
);

// Customer Sign In
router.post(
  '/signin',
  UserController.validateCustomerSignIn,
  UserController.customerSignIn,
);

module.exports = router;
