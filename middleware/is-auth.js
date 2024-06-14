const CognitoExpress = require('cognito-express');
const jet = require('jsonwebtoken');
const config = require('../config/production.json');
const User = require('../models/user');

const cognitoExpress = new CognitoExpress({
  region: config.region,
  cognitoUserPoolId: config.userPoolId,
  tokenUse: 'access', // Use 'access' or 'id' as required
  tokenExpiration: config.tokenExpiration,
});

function isCognitoAuthenticated(req, res, next) {
  const token = req.header('cognito-token');

  //  Check if the token is valid
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  cognitoExpress.validate(token, async function (err, response) {
    //  If the token is invalid
    if (err) return res.status(401).json({ err });

    //  Else, the token is valid
    req.userSub = response.sub;
    let user = await User.findOne({ userId: response.sub });
    req.userId = null;

    if (user) {
      req.userId = user._id;
    }
    next();
  });
}

function isCognitoAuthenticatedByJWT(req, res, next) {
  //  Get the token from the header
  const token = req.headers('cognito-token');

  //  Check if the token is valid
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  //  Verify the token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.userSub = decoded.sub;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = { isCognitoAuthenticated, isCognitoAuthenticatedByJWT };
