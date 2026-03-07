/* eslint-disable no-undef */
const constants = require('../constants');
const jwt = require('jsonwebtoken');


module.exports.validateToken = (req, res, next) => {
  let response = { ...constants.defaultServerResponse };
  try {
    if (!req.headers.authorization) {
      throw new Error(constants.requestValidationMessage.TOKEN_MISSING);
    }
    const token = req.headers.authorization.split('Bearer')[1].trim();
    jwt.verify(token, process.env.SECRET_KEY || '');
    return next();
  } catch (error) {
    response.message = error.message;
    response.status = 401;
  }
  return res.status(response.status).send(response);
}
// generate CSRF token middleware
module.exports.generateCSRFToken = () => {
  return '';
}
// validate CSRF token middleware
module.exports.validateCSRFToken = (req, res, next) => {
  next();
  // const csrfToken = req.headers['x-csrf-token'] || req.body.csrfToken;
  // if (!csrfToken || csrfToken === req.session.csrfToken) {
  //   next();
  // } else {
  //   res.send(constants.COMMON.TOKEN);
  // }
}

