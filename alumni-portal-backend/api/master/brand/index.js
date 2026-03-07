/** Author : Sathish
 *  Created Date : 23 Dec 2024
 *  Description  : Brand master route
 */
'use strict';

var express = require('express');
var brand = require('./brand.controller');
const joiSchemaValidation = require('../../../middleware/joiSchemaValidation');
const brandMgmtSchema = require('../../../apiSchema/brandMgmtSchema');
const token = require('../../../middleware/tokenValidation');
var router = express.Router();

/** save brand details*/
router.post('/setBrand', token.validateCSRFToken,
    joiSchemaValidation.validateBody(brandMgmtSchema.setBrand),
    brand.setBrand
);

/** update brand details*/
router.post('/updateBrand', token.validateCSRFToken,
    joiSchemaValidation.validateBody(brandMgmtSchema.updateBrand),
    brand.updateBrand
);

/** delete brand details*/
router.post('/deleteBrand', token.validateCSRFToken,
    joiSchemaValidation.validateBody(brandMgmtSchema.deleteBrand),
    brand.deleteBrand
);

/** list brand details*/
router.post('/getBrandList', token.validateCSRFToken,
    joiSchemaValidation.validateBody(brandMgmtSchema.getBrandList),
    brand.getBrandList
);

/** Editload brand details*/
router.post('/getBrandDetails', token.validateCSRFToken,
    joiSchemaValidation.validateBody(brandMgmtSchema.getBrandDetails),
    brand.getBrandDetails
);
module.exports = router;