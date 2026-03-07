/** Author : Anusha
 *  Created Date : 26 Dec 2024
 *  Description  : Change password route
 */
'use strict';

var express = require('express');
var changedPasword= require('./changePassword.controller');
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
const changePasswordMgmtSchema = require('../../apiSchema/changePasswordMgmtSchema');
const token = require('../../middleware/tokenValidation');
var router = express.Router();

/** changed password*/
router.post('/loginChangePassword', token.validateCSRFToken,
    joiSchemaValidation.validateBody(changePasswordMgmtSchema.changePassword),
    changedPasword.loginChangePassword
);

/** changed password*/
router.post('/vendorChangePassword', token.validateCSRFToken,
    joiSchemaValidation.validateBody(changePasswordMgmtSchema.changePassword),
    changedPasword.vendorChangePassword
);

/** changed password*/
router.post('/verifierChangePassword', token.validateCSRFToken,
    joiSchemaValidation.validateBody(changePasswordMgmtSchema.changePassword),
    changedPasword.verifierChangePassword
);
module.exports = router;
