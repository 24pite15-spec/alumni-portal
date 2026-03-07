//* eslint-disable no-undef */
/** Author : Deepa
 *  Created date :  13-05-2025
 *  Description : financial year Sync service
 */
const errorlogService = require('./ErrorLogMgmtService');
const constants = require('../constants');
const pool = require('../database/connection');
const cron = require('node-cron');

/**  Schedule a task to run daily 1 AM */
// cron.schedule('0 1 * * *', async () => {
cron.schedule('*/1 * * * *', async () => {
    try {
        const varResponse = await module.exports.udfnSyncFinancialYear();
        return varResponse;
    }
    catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Sync Financial Year", error, "udfnSyncFinancialYear");
        return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error }
    }
});

module.exports.udfnSyncFinancialYear = async () => {
    try {
        const result = await pool.query(`SELECT  CASE  WHEN EXTRACT(MONTH FROM CURRENT_DATE) = 4 AND EXTRACT(DAY FROM CURRENT_DATE) = 1 THEN 1 ELSE 0 END AS result;`)
        let varResponse = [];
        if (result && result.rows && result.rows[0] && result.rows[0].result === 1) {
            await pool.query(`BEGIN`);
            await pool.query(`UPDATE def_financial_year SET fy_status = 2 WHERE fy_fromyear != EXTRACT(YEAR FROM CURRENT_DATE)::INT; `);
            varResponse = await pool.query(` INSERT INTO def_financial_year ( fy_code, fy_fromyear, fy_toyear, fy_status, fy_from_date, fy_to_date ) SELECT (SELECT COALESCE(MAX(fy_code), 0) + 1 FROM def_financial_year) AS fy_code, EXTRACT(YEAR FROM CURRENT_DATE)::INT AS fy_fromyear, (EXTRACT(YEAR FROM CURRENT_DATE) + 1)::INT AS fy_toyear, 1 AS fy_status, 
                 MAKE_DATE(EXTRACT(YEAR FROM CURRENT_DATE)::INT, 4, 1) as fy_from_date,
                 MAKE_DATE(EXTRACT(YEAR FROM CURRENT_DATE)::INT + 1, 3, 31) as fy_to_date
                WHERE NOT EXISTS ( SELECT 1 FROM def_financial_year  WHERE fy_fromyear = EXTRACT(YEAR FROM CURRENT_DATE)::INT ); ` );
            await pool.query(`COMMIT`);
        }
        if (varResponse?.rowCount > 0) {
            const response = { "status": constants.COMMON.SUCCESS_CODE, "statuscode": constants.COMMON.SUCCESS_CODE, "message": constants.COMMON.SUCCESS_MESSAGE };
            return response;
        }
    }
    catch (error) {
        await pool.query(`ROLLBACK`);
        await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Sync Finalcial Year", error, "udfnSyncFinancialYear");
        return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error }
    }
}