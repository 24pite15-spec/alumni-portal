/** Author : Kavitha
 *  Created Date : 24 Oct 2024
 *  Description  : master route
 */
'use strict';

var express = require('express');
var mastertype = require('./master.controller');
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
const masterMgmtSchema = require('../../apiSchema/masterMgmtSchema');
const token = require('../../middleware/tokenValidation');

var router = express.Router();

/** Get Status Details */
router.post('/getStatusDetails', token.validateCSRFToken,
    joiSchemaValidation.validateBody(masterMgmtSchema.getStatusDetails),
    mastertype.getStatusDetails
);
/** Get State Details */
router.post('/getStateDetails', token.validateCSRFToken,
    joiSchemaValidation.validateBody(masterMgmtSchema.getStateDetails),
    mastertype.getStateDetails
);

/** Get Reject Reason List*/
router.post('/getRejectReasonList', token.validateCSRFToken,
    joiSchemaValidation.validateBody(masterMgmtSchema.getRejectReasonList),
    mastertype.getRejectReasonList
);
/** Get Tax List*/
router.post('/getTaxList', token.validateCSRFToken,
    joiSchemaValidation.validateBody(masterMgmtSchema.getTaxList),
    mastertype.getTaxList
);

/** Get Status Details */
router.post('/getTransactionStatusDetails', token.validateCSRFToken,
    joiSchemaValidation.validateBody(masterMgmtSchema.getTransactionStatusDetails),
    mastertype.getTransactionStatusDetails
);
module.exports = router;