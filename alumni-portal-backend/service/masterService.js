/** Author : Kavitha
 *  Created Date : 24 Oct 2024
 *  Modified By : Sathish
 *  Modified Date : 20 Dec 2024
 *  Description  : master service
 */
const commonService = require('../service/commonService');
const errorlogService = require('../service/ErrorLogMgmtService');
const constants = require('../constants');
const pool = require('../database/connection');

/** list status details*/
module.exports.getStatusDetails = async (req) => {
    try {
        const decoded = await commonService.validateToken(req);
        if (!decoded) { return constants.COMMON.INVALID_TOKEN; }
        if (req.body.source === 0) { return constants.COMMON.INVALID_RESPONSE; }
        let checkuser = '';

        if (req.body.source === 1) {
            if (req.body.is_partner == 0) {
                checkuser = await commonService.checkUserId(req.body);
                if (!checkuser) { return constants.COMMON.INVALID_USER; };
            } else {
                checkuser = await commonService.checkPartnerUserId(req.body);
                if (!checkuser) { return constants.COMMON.INVALID_USER; };
            }
        }
        else if (req.body.source === 2) {
            checkuser = await commonService.vendorCheckUserId(req.body);
            if (!checkuser) { return constants.COMMON.INVALID_USER; };
        } else if (req.body.source === 3) {
            checkuser = await commonService.verifierCheckUserId(req.body);
            if (!checkuser) { return constants.COMMON.INVALID_USER; };
        }
        if (req) {
            let varGetData = [];
            if (req.body.source === 3) {
                varGetData = await pool.query(`SELECT stsid AS value, sts_name AS label FROM def_status WHERE COALESCE(sts_typeid,0)=1 AND stsid != 6  ORDER BY sts_orderid ASC`);
            }
            else {
                varGetData = await pool.query(`SELECT stsid AS value, sts_name AS label FROM def_status WHERE COALESCE(sts_typeid,0)=1 ORDER BY sts_orderid ASC`);
            }
            if (varGetData.rowCount > 0) {
                return { ...constants.COMMON.DATAFETCH_RESPONSE, ...{ "data": { "status_details": varGetData.rows } } };
            }
            else {
                return { ...constants.COMMON.NORECORD_RESPONSE, ...{ "data": { "status_details": [] } } };
            }
        }
        else { return constants.COMMON.INVALID_RESPONSE; }
    } catch (error) {
        await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "status details", error, "getStatusDetails");
        return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error }
    }
}

/** list state details*/
module.exports.getStateDetails = async (req) => {
    try {
        //Remove Token for Partner Signup page load DD issue
        // const decoded = await commonService.validateToken(req);
        // if (!decoded) { return constants.COMMON.INVALID_TOKEN; }
        // let checkuser = await commonService.checkUserId(req.body);
        // if (!checkuser) { return constants.COMMON.INVALID_USER; };
        if (req) {
            const varGetData = await pool.query(`select stid as value, st_name as label from def_state ORDER BY st_name`);
            if (varGetData.rowCount > 0) {
                return { ...constants.COMMON.DATAFETCH_RESPONSE, ...{ "data": { "state_details": varGetData.rows } } };
            }
            else {
                return { ...constants.COMMON.NORECORD_RESPONSE, ...{ "data": { "state_details": [] } } };
            }
        }
        else { return constants.COMMON.INVALID_RESPONSE; }
    } catch (error) {
        await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "state details", error, "getStateDetails");
        return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error }
    }
}

/** list state details*/
module.exports.getRejectReasonList = async (req) => {
    try {
        const decoded = await commonService.validateToken(req);
        if (!decoded) { return constants.COMMON.INVALID_TOKEN; }
        if (req.body.source === 0) { return constants.COMMON.INVALID_RESPONSE; }
        let checkuser = '';
        if (req.body.source === 1) {
            checkuser = await commonService.checkUserId(req.body);
            if (!checkuser) { return constants.COMMON.INVALID_USER; };
        }
        else if (req.body.source === 2) {
            checkuser = await commonService.vendorCheckUserId(req.body);
            if (!checkuser) { return constants.COMMON.INVALID_USER; };
        } else if (req.body.source === 3) {
            checkuser = await commonService.verifierCheckUserId(req.body);
            if (!checkuser) { return constants.COMMON.INVALID_USER; };
        }
        if (req) {
            const varGetData = await pool.query(`SELECT mstid AS reason_id, mst_name AS reason FROM def_master WHERE mst_type_id = 2`);
            if (varGetData.rowCount > 0) {
                return { ...constants.COMMON.DATAFETCH_RESPONSE, ...{ "data": { "reject_reason_list": varGetData.rows } } };
            }
            else {
                return { ...constants.COMMON.NORECORD_RESPONSE, ...{ "data": { "reject_reason_list": [] } } };
            }
        }
        else { return constants.COMMON.INVALID_RESPONSE; }
    } catch (error) {
        await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Reject List", error, "getRejectReasonList");
        return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error }
    }
}

/** list tax details*/
module.exports.getTaxList = async (req) => {
    try {
        const decoded = await commonService.validateToken(req);
        if (!decoded) { return constants.COMMON.INVALID_TOKEN; }
        const checkuser = await commonService.checkUserId(req.body);
        if (!checkuser) { return constants.COMMON.INVALID_USER; };
        if (req) {
            const varGetData = await pool.query(`SELECT taxid AS value, tax_name AS label FROM def_tax`);
            if (varGetData.rowCount > 0) {
                return { ...constants.COMMON.DATAFETCH_RESPONSE, ...{ "data": { "tax_list": varGetData.rows } } };
            }
            else {
                return { ...constants.COMMON.NORECORD_RESPONSE, ...{ "data": { "tax_list": [] } } };
            }
        }
        else { return constants.COMMON.INVALID_RESPONSE; }
    } catch (error) {
        await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Reject List", error, "getRejectReasonList");
        return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error }
    }
}

module.exports.getTransactionStatusDetails = async (req) => {
    try {
        const decoded = await commonService.validateToken(req);
        if (!decoded) { return constants.COMMON.INVALID_TOKEN; }
        const checkuser = await commonService.checkUserId(req.body);
        if (!checkuser) { return constants.COMMON.INVALID_USER; };
       
        if (req) {
            const { order_flag, filter_by } = req.body;
            let varGetData = [];
            
           varGetData = await pool.query('SELECT CASE WHEN ' + order_flag + '= 1 THEN ROW_NUMBER() OVER(ORDER BY dts_order_id ASC) ELSE ROW_NUMBER() OVER(ORDER BY dts_order_id desc) 	END AS sno, dts_stsid AS status_id, dts_sts_name AS status_name, dts_filter_flag AS filter_flag FROM def_transaction_status WHERE  $1 = 0  OR $1 = ANY(dts_filter_flag)', [filter_by]);
            if (varGetData.rowCount > 0) {
                return { ...constants.COMMON.DATAFETCH_RESPONSE, ...{ "data": { "status_details": varGetData.rows } } };
            }
            else {
                return { ...constants.COMMON.NORECORD_RESPONSE, ...{ "data": { "status_details": [] } } };
            }
        }
        else { return constants.COMMON.INVALID_RESPONSE; }
    } catch (error) {
        await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "status details", error, "getTransactionStatusDetails");
        return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error }
    }
}