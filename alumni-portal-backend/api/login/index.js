'use strict';

var express = require('express');
var login = require('./login.controller');
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
const loginMgmtSchema = require('../../apiSchema/loginMgmtSchema');
const token = require('../../middleware/tokenValidation');
var router = express.Router();
router.get('/formLoad', token.generateCSRFToken, (req, res) => {
  res.json({ csrfToken: req.csrfToken });
});
/** Login user */
router.post('/login',
  joiSchemaValidation.validateBody(loginMgmtSchema.login),
  login.login
);
/** Get refresh Token */
router.post('/refreshToken',
  joiSchemaValidation.validateBody(loginMgmtSchema.refreshToken),
  login.refreshToken
);

/** Login vendor */
router.post('/vendorLogin',
  joiSchemaValidation.validateBody(loginMgmtSchema.vendorLogin),
  login.vendorLogin
);

/** Login verifier */
router.post('/verifierLogin',
  joiSchemaValidation.validateBody(loginMgmtSchema.login),
  login.verifierLogin
);

/** send verdor verification code */
router.post('/setVendorVerificationCode',
  joiSchemaValidation.validateBody(loginMgmtSchema.setVendorVerificationCode),
  login.setVendorVerificationCode
);

/** vendor verification */
router.post('/getVendorVerification',
  joiSchemaValidation.validateBody(loginMgmtSchema.getVendorVerification),
  login.getVendorVerification
);
module.exports = router;