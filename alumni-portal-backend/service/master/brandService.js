/** Author : Sathish
 *  Created Date : 23 Dec 2024
 *  Description  : Brand master service
 */
const commonService = require('../../service/commonService');
const errorlogService = require('../../service/ErrorLogMgmtService');
const constants = require('../../constants');
const pool = require('../../database/connection');

/** Save Brand*/
module.exports.setBrand = async (req) => {
  try {
    const decoded = await commonService.validateToken(req);
    if (!decoded) { return constants.COMMON.INVALID_TOKEN; }
    let checkuser = await commonService.checkUserId(req.body);
    if (!checkuser) { return constants.COMMON.INVALID_USER; }
    if (req.body) {
      await pool.query('BEGIN');
      const { user_name, brand_name, category_id } = req.body;
      if (brand_name.trim() == '') {
        return constants.COMMON.INVALID_RESPONSE;
      }
      const varCategoryExists = await pool.query(`SELECT COUNT(pcid) AS total FROM mr_product_category WHERE pcid=  $1`, [category_id]);
      if (varCategoryExists && varCategoryExists.rows.length > 0 && varCategoryExists.rows[0].total == 0) {
        return constants.COMMON.INVALID_RESPONSE;
      }
      const varBrandNameExists = await pool.query(`SELECT count(brid) AS total FROM mr_device_brand WHERE LOWER(br_name) = $1 AND br_pcid = $2`, [brand_name.trim().toLowerCase(), category_id]);
      if (varBrandNameExists && varBrandNameExists.rows.length > 0 && varBrandNameExists.rows[0].total > 0) {
        return constants.COMMON.EXIST_RESPONSE;
      }
      const varResult = await pool.query(`INSERT INTO mr_device_brand(brid,br_name,br_pcid,br_maker,br_created,br_sid) VALUES ((SELECT COALESCE(max(brid),0)+1 as brid FROM mr_device_brand), $1,$2,$3,CURRENT_TIMESTAMP,(SELECT COALESCE(max(br_sid),9)+1 as br_sid FROM mr_device_brand) ) RETURNING brid`, [brand_name.trim(), category_id, user_name]);
      await pool.query('COMMIT')
      return { ...constants.COMMON.SAVE_RESPONSE, ...{ "data": { "brand_id": varResult.rows[0].brid } } }
    }
    else { return constants.COMMON.INVALID_RESPONSE; }
  } catch (error) {
    await pool.query('ROLLBACK');
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Brand Master", error, "setBrand");
    return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error }
  }
}
/** Update Brand details*/
module.exports.updateBrand = async (req) => {
  try {
    const decoded = await commonService.validateToken(req);
    if (!decoded) { return constants.COMMON.INVALID_TOKEN; }
    let checkuser = await commonService.checkUserId(req.body);
    if (!checkuser) { return constants.COMMON.INVALID_USER; }
    if (req.body) {
      await pool.query('BEGIN')
      const { user_name, category_id, brand_id, brand_name } = req.body;
      if (category_id > 0 && brand_id > 0) {
        if (brand_name.trim() == '') {
          return constants.COMMON.INVALID_RESPONSE;
        }
        const varCategoryBrandIdExist = await pool.query(`SELECT SUM(total)AS total FROM (SELECT COUNT(pcid) AS total FROM mr_product_category WHERE pcid =$1 UNION ALL SELECT COUNT(brid) AS total FROM mr_device_brand WHERE brid =$2)DIV `, [category_id, brand_id]);
        if (varCategoryBrandIdExist && varCategoryBrandIdExist.rows.length > 0 && varCategoryBrandIdExist.rows[0].total < 2) {
          return constants.COMMON.INVALID_RESPONSE;
        }
        const varBrandNameExist = await pool.query(`SELECT COUNT(brid) AS total FROM mr_device_brand WHERE  LOWER(br_name) =  $1 AND br_pcid = $3 AND brid!=$2`, [brand_name.trim().toLowerCase(), brand_id, category_id]);
        if (varBrandNameExist && varBrandNameExist.rows.length > 0 && varBrandNameExist.rows[0].total > 0) {
          return constants.COMMON.EXIST_RESPONSE;
        }
        await pool.query(`UPDATE mr_device_brand SET br_name = $1,br_pcid=$2,br_updater=$3,br_updated=CURRENT_TIMESTAMP WHERE brid=$4`, [brand_name.trim(), category_id, user_name, brand_id]);

        await pool.query('COMMIT');
        return { ...constants.COMMON.UPDATE_RESPONSE, ...{ "data": { "brand_id": brand_id } } }
      }
      else { return constants.COMMON.INVALID_RESPONSE; }
    }
    else { return constants.COMMON.INVALID_RESPONSE; }
  } catch (error) {
    await pool.query('ROLLBACK');
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Brand Master", error, "updateBrand");
    return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error }
  }
}
/** Delete Brand*/
module.exports.deleteBrand = async (req) => {
  try {
    const decoded = await commonService.validateToken(req);
    if (!decoded) { return constants.COMMON.INVALID_TOKEN; }
    let checkuser = await commonService.checkUserId(req.body);
    if (!checkuser) { return constants.COMMON.INVALID_USER; }
    if (req.body) {
      await pool.query('BEGIN')
      const { brand_id } = req.body;
      const varBrandIDExists = await pool.query(`SELECT COUNT(brid) AS total FROM mr_device_brand WHERE brid = $1`, [brand_id]);
      if (varBrandIDExists && varBrandIDExists.rows.length > 0 && varBrandIDExists.rows[0].total == 0) {
        return constants.COMMON.INVALID_RESPONSE;
      }
      const varBrandUsed = await pool.query(`SELECT count(dm_brid) as total FROM mr_device_model WHERE dm_brid =  $1 `, [brand_id]);
      if (varBrandUsed && varBrandUsed.rows.length > 0 && varBrandUsed.rows[0].total > 0) {
        return constants.COMMON.INUSE_RESPONSE;
      }
      await pool.query(`DELETE FROM mr_device_brand WHERE brid = $1 `, [brand_id]);
      await pool.query('COMMIT')
      return constants.COMMON.DELETE_RESPONSE;
    }
    else { return constants.COMMON.INVALID_RESPONSE; }
  } catch (error) {
    await pool.query('ROLLBACK');
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Brand Master", error, "deleteBrand");
    return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error }
  }
}
/** List Brand*/
module.exports.getBrandList = async (req) => {
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
      const { order_flag } = req.body;
      if (order_flag != 1 && order_flag != 2) {
        return constants.COMMON.INVALID_RESPONSE;
      }
      const varGetData = await pool.query(` SELECT CASE WHEN ` + order_flag + `= 1 THEN ROW_NUMBER() OVER(ORDER BY br_name ASC) WHEN ` + order_flag + `= 2 THEN ROW_NUMBER() OVER(ORDER BY br_created desc) END AS sno, brid AS value,pcid AS category_id,pc_name AS category_name,br_name AS label,COUNT(DISTINCT dmid) AS total_model, COUNT(DISTINCT vtid) AS total_variant FROM mr_device_brand  INNER JOIN mr_product_category ON pcid=br_pcid  LEFT JOIN mr_device_model ON dm_brid = brid LEFT JOIN mr_variant ON vt_dmid = dmid GROUP BY br_name , br_created, brid, pcid, br_name, pc_name`);
      if (varGetData.rowCount > 0) {
        return { ...constants.COMMON.DATAFETCH_RESPONSE, ...{ "data": { "brand_list": varGetData.rows } } };
      } else {
        return { ...constants.COMMON.NORECORD_RESPONSE, ...{ "data": { "brand_list": [] } } };
      }
    }
    else {
      return constants.COMMON.INVALID_RESPONSE;
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Brand Master", error, "getBrandList");
    return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error };
  }
}
/** List Brand details*/
module.exports.getBrandDetails = async (req) => {
  try {
    const decoded = await commonService.validateToken(req);
    if (!decoded) { return constants.COMMON.INVALID_TOKEN; }
    let checkuser = await commonService.checkUserId(req.body);
    if (!checkuser) { return constants.COMMON.INVALID_USER; };
    if (req) {
      const { brand_id } = req.body;
      const varBrandIdExists = await pool.query(`SELECT COUNT(brid) AS total FROM mr_device_brand WHERE brid = $1`, [brand_id]);
      if (varBrandIdExists && varBrandIdExists.rows.length > 0 && varBrandIdExists.rows[0].total == 0) {
        return constants.COMMON.INVALID_RESPONSE;
      }
      const varGetdata = await pool.query(`SELECT brid AS brand_id,br_name AS brand_name,pcid AS category_id,pc_name AS category_name FROM(SELECT brid,br_name,br_pcid FROM mr_device_brand WHERE brid=$1)br INNER JOIN mr_product_category ON pcid=br_pcid`, [brand_id]);
      if (varGetdata.rowCount > 0) {
        return { ...constants.COMMON.DATAFETCH_RESPONSE, ...{ "data": { "brand_details": varGetdata.rows } } };
      }
      else { return { ...constants.COMMON.NORECORD_RESPONSE, ...{ "data": { "brand_details": [] } } }; }
    }
    else { return constants.COMMON.INVALID_RESPONSE; }
  } catch (error) {
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Brand Master", error, "getBrandDetails");
    return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error }
  }
}
