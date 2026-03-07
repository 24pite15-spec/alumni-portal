const commonService = require('../service/commonService');
const token = require('../middleware/tokenValidation');
const errorlogService = require('../service/ErrorLogMgmtService');
const constants = require('../constants');
const pool = require('../database/connection');
const nodemailer = require('nodemailer');
const fyService = require('../service/fyCronService');
//login service
module.exports.login = async (req, res) => {
  try {
    if (req.user_id && req.password) {
      await pool.query('BEGIN')
      const { user_id, password } = req;
      const accessToken = await commonService.generateAccessToken({ user: user_id });
      const refreshToken = await commonService.generateRefreshToken({ user: user_id });
      const csrfToken = '';//await token.generateCSRFToken(req, res);
      var varResponse = {}
      let varUser = [], varPartner = [], is_partner = 0;
      const varCompany = await pool.query(`SELECT COALESCE(com_name,'') AS com_name FROM mr_company`);
      varUser = await pool.query(`SELECT usid as userid, us_pwd as password FROM mr_users WHERE LOWER(us_name) = $1`, [user_id.toLowerCase().trim()]);
      varPartner = await pool.query(`SELECT prid as userid, pr_pwd as password FROM mr_partner WHERE LOWER(pr_email) = $1`, [user_id.toLowerCase().trim()]);
      await fyService.udfnSyncFinancialYear();
      const varFYDetails = await pool.query(`SELECT fy_code AS fy_id, CAST(fy_fromyear AS TEXT) || '-' || CAST(fy_toyear AS TEXT) AS fy_text,COALESCE(fy_from_date,'') AS from_date,COALESCE(fy_to_date,'') AS to_date  FROM def_financial_year WHERE fy_status = 1`);
      if (varUser && varUser.rows.length > 0) {
        const varDecryptPassword = await commonService.decryptpassword({ pwd: varUser.rows[0].password });
        if (password == varDecryptPassword) {
          const varLoginDetails = await pool.query(`SELECT us_roleid AS role_id,usid as user_id, us_name as user_name, us_displayname as user_display_name,us_stsid as status_code,to_char(us_lastlogin, 'DD-MM-YYYY HH12:MI PM') as last_login FROM mr_users as a  WHERE usid=  $1`, [varUser.rows[0].userid]);
          if (varLoginDetails && varLoginDetails.rows.length > 0 && varLoginDetails.rows[0].total == 0) { return constants.COMMON.INVALID_RESPONSE; }
          var varLoginarray = varLoginDetails.rows[0];
          if (varLoginarray.status_code == '1') {
            const user_id = varLoginDetails.rows[0].user_id;
            await pool.query(`UPDATE mr_users SET us_lastlogin = CURRENT_TIMESTAMP WHERE usid = ` + user_id);
            await pool.query('COMMIT');
            res.cookie('username', user_id, { httpOnly: true, secure: true });
            const role_id = varLoginDetails.rows[0].role_id;
            /** get user role details */
            const varUserRoleQuery = 'SELECT urid AS role_id, ur_name AS role_name, ur_default AS is_default FROM mr_user_role WHERE urid = ' + role_id;
            const varUserRoleData = await pool.query(varUserRoleQuery);
            let varMenuAccessQuery = '';
            if (varUserRoleData && varUserRoleData.rows.length > 0 && varUserRoleData.rows[0].is_default == 1) {
              varMenuAccessQuery = 'SELECT     mid::INT AS parent_id,    m_smid::INT AS menu_id,    array_to_json(m_default_access) AS access_level FROM public.def_menu ORDER BY m_smid;'
            }
            else {
              varMenuAccessQuery = 'SELECT CAST(urp_mid AS INTEGER) AS  parent_id, CAST(urp_smid AS INTEGER) AS menu_id,  json_agg(urp_typeid) AS access_level  FROM mr_user_role_privileges WHERE urp_urid = ' + role_id + ' GROUP BY urp_mid, urp_smid;'
            }

            const varMenuDetails = await pool.query(varMenuAccessQuery);
            let varRoleDetails = {};
            if (varUserRoleData.rowCount > 0) {
              const varParentMenu = Array.from(
                new Map(varMenuDetails.rows.map(item => [parseInt(item.parent_id, 10), parseInt(item.parent_id, 10)])).values()
              );
              varRoleDetails = { "user_role_name": varUserRoleData.rows[0].role_name, "parent_menu": varParentMenu, "menu_access": varMenuDetails.rows };
            }

            varResponse = {
              ...constants.COMMON.LOGIN_SUCCESS_RESPONSE, ...{ "data": { "UserInfo": { ...varLoginarray, ...{ access_token: accessToken, refresh_token: refreshToken, csrf_Token: csrfToken, "is_partner": is_partner, "company_name": varCompany?.rows?.[0]?.com_name || "", "user_role": varRoleDetails, financial_yr_id: varFYDetails.rows[0].fy_id, financial_year: varFYDetails.rows[0].fy_text, from_date: varFYDetails.rows[0].from_date, to_date: varFYDetails.rows[0].to_date } } } }
            }
            return varResponse
          }
          else { return constants.COMMON.UNAPPROVED_RESPONSE; }
        }
        else { return constants.COMMON.LOGIN_FAIL_RESPONSE; }
      }
      else if (varPartner && varPartner.rows.length > 0) {
        varUser = varPartner; is_partner = 1;
        const varDecryptPassword = await commonService.decryptpassword({ pwd: varUser.rows[0].password });
        if (password == varDecryptPassword) {
          const varLoginDetails = await pool.query(`SELECT prid as user_id, pr_email as user_name, pr_name as user_display_name,pr_stsid as status_code,to_char(pr_last_login, 'DD-MM-YYYY HH12:MI PM') as last_login FROM mr_partner as a  WHERE prid=  $1`, [varUser.rows[0].userid]);
          if (varLoginDetails && varLoginDetails.rows.length > 0 && varLoginDetails.rows[0].total == 0) { return constants.COMMON.INVALID_RESPONSE; }
          var varPartnerLoginarray = varLoginDetails.rows[0];
          if (varPartnerLoginarray.status_code == '1') {
            const user_id = varLoginDetails.rows[0].user_id;
            await pool.query(`UPDATE mr_partner SET pr_last_login = CURRENT_TIMESTAMP WHERE prid = ` + user_id);
            await pool.query('COMMIT');
            res.cookie('username', user_id, { httpOnly: true, secure: true });
            varResponse = {
              ...constants.COMMON.LOGIN_SUCCESS_RESPONSE, ...{ "data": { "UserInfo": { ...varPartnerLoginarray, ...{ access_token: accessToken, refresh_token: refreshToken, csrf_Token: csrfToken, "is_partner": is_partner, "company_name": varCompany?.rows?.[0]?.com_name || "" } } } }
            }
            return varResponse
          }
          else { return constants.COMMON.UNAPPROVED_RESPONSE; }
        }
        else { return constants.COMMON.LOGIN_FAIL_RESPONSE; }
      }
      else { return constants.COMMON.LOGIN_FAIL_RESPONSE; }
    }
  } catch (error) {
    await pool.query('ROLLBACK');
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Login", error, "login");
    return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error };
  }
}

//vendor login service
module.exports.vendorLogin = async (req, res) => {
  try {
    if (req.user_id) {
      await pool.query('BEGIN');
      const { user_id } = req;
      const accessToken = await commonService.generateAccessToken({ user: user_id });
      const refreshToken = await commonService.generateRefreshToken({ user: user_id });
      const csrfToken = '';//await token.generateCSRFToken(req, res);
      var response = {}
      const user = await pool.query(`SELECT strid AS store_id, str_pwd AS password,str_prid AS partner_id FROM mr_store WHERE LOWER(str_email) = $1`, [user_id.toLowerCase().trim()]);
      const varCompany = await pool.query(`SELECT COALESCE(com_name,'') AS com_name FROM mr_company`);
      if (user && user.rows.length > 0) {
        const varLoginDetails = await pool.query(` SELECT a.strid AS store_id, a.str_name AS store_name,a.str_email AS store_email,
              a.str_stsid AS status_id,COALESCE(to_char(a.str_lastlogin, 'DD-MM-YYYY HH12:MI PM'), '') AS last_login,COALESCE(b.prid,0) AS partner_id,
              COALESCE(b.pr_name,'') AS partner_name,COALESCE(str_show_device_details,0)  AS show_newdevice_details FROM mr_store AS a LEFT JOIN mr_partner AS b ON a.str_prid = b.prid WHERE a.strid = $1`, [user.rows[0].store_id]
        );
        var Loginarray = varLoginDetails.rows[0];
        if (Loginarray.status_id == '2') { return constants.COMMON.INACTIVE_RESPONSE; }
        if (Loginarray.status_id == '1') {
          const user_id = varLoginDetails.rows[0].store_id;
          await pool.query(`UPDATE mr_store SET str_lastlogin = CURRENT_TIMESTAMP WHERE strid = ` + user_id);
          await pool.query('COMMIT');
          res.cookie('vendorname', user_id, { httpOnly: true, secure: true });
          response = {
            ...constants.COMMON.LOGIN_SUCCESS_RESPONSE, ...{ "data": { "UserInfo": { ...Loginarray, ...{ access_token: accessToken, refresh_token: refreshToken, csrf_Token: csrfToken, "company_name": varCompany?.rows?.[0]?.com_name || "" } } } }
          }
          return response
        }
        else { return constants.COMMON.UNAPPROVED_RESPONSE; }

      }
      else { return constants.COMMON.LOGIN_FAIL_RESPONSE; }
    }
  } catch (error) {
    await pool.query('ROLLBACK');
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "VendorLogin", error, "VendorLogin");
    return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error };
  }
}

//verifier login service
module.exports.verifierLogin = async (req, res) => {
  try {
    if (req.user_id && req.password) {
      await pool.query('BEGIN');
      const { user_id, password, fcm_token } = req;
      const accessToken = await commonService.generateAccessToken({ user: user_id });
      const refreshToken = await commonService.generateRefreshToken({ user: user_id });
      const csrfToken = '';//await token.generateCSRFToken(req, res);
      var varResponse = {}
      const varUser = await pool.query(`SELECT vrid AS verifier_id, vr_pwd AS password FROM mr_verifier WHERE LOWER(vr_email) = $1`, [user_id.toLowerCase().trim()]);
      if (varUser && varUser.rows.length > 0) {
        const varDecryptPassword = await commonService.decryptpassword({ pwd: varUser.rows[0].password });
        if (password == varDecryptPassword) {
          const varLoginDetails = await pool.query(`SELECT vrid AS verifier_id,vr_name AS verifier_name,vr_email AS verifier_email,vr_stsid AS status_id,COALESCE(to_char(vr_lastlogin, 'DD-MM-YYYY HH12:MI PM'), '') AS last_login FROM mr_verifier as a  WHERE vrid= $1`, [varUser.rows[0].verifier_id]);
          const varCompany = await pool.query(`SELECT COALESCE(com_name,'') AS com_name FROM mr_company`);
          if (varLoginDetails && varLoginDetails.rows.length > 0 && varLoginDetails.rows[0].total == 0) { return constants.COMMON.INVALID_RESPONSE; }
          var varLoginarray = varLoginDetails.rows[0];
          if (varLoginarray.status_id == '1') {
            const user_id = varLoginDetails.rows[0].verifier_id;
            await pool.query(`UPDATE mr_verifier SET vr_lastlogin = CURRENT_TIMESTAMP WHERE vrid = ` + user_id);
            await pool.query('COMMIT');
            if (fcm_token != null && fcm_token != undefined && fcm_token != '') {
              await updateFCMToken(user_id, fcm_token, 3);
            }

            res.cookie('verifiername', user_id, { httpOnly: true, secure: true });
            varResponse = {
              ...constants.COMMON.LOGIN_SUCCESS_RESPONSE, ...{ "data": { "UserInfo": { ...varLoginarray, ...{ access_token: accessToken, refresh_token: refreshToken, csrf_Token: csrfToken, "company_name": varCompany?.rows?.[0]?.com_name || "" } } } }
            }
            return varResponse
          }
          else { return constants.COMMON.UNAPPROVED_RESPONSE; }
        }
        else { return constants.COMMON.LOGIN_FAIL_RESPONSE; }
      }
      else { return constants.COMMON.LOGIN_FAIL_RESPONSE; }
    }
  } catch (error) {
    await pool.query('ROLLBACK');
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "VerifierLogin", error, "verifierLogin");
    return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error };
  }
}

async function updateFCMToken(user_id, fcm_token, typeid) { // type 1 for Partner,2 for Vendor, 3 for Verifier, 
  try {

    await pool.query('BEGIN');
    if (typeid == 3) {
      const varUser = await pool.query(`SELECT vftid, vft_verifier_id, vft_status_code FROM mr_verifier_fcm_token WHERE vft_fcm_token = $1 and vft_verifier_id = $2`, [fcm_token, user_id]);
      if (varUser && varUser?.rows?.length > 0) {
        await pool.query(`DELETE FROM mr_verifier_fcm_token WHERE vft_fcm_token = $1 and vft_verifier_id = $2`, [fcm_token, user_id]);
        await pool.query(`INSERT INTO mr_verifier_fcm_token (vft_verifier_id, vft_fcm_token, vft_status_code) VALUES ($1, $2, 1)`, [user_id, fcm_token]);
      }
      else if (varUser && varUser?.rows?.length == 0) {
        await pool.query(`INSERT INTO mr_verifier_fcm_token (vft_verifier_id, vft_fcm_token, vft_status_code) VALUES ($1, $2, 1)`, [user_id, fcm_token]);
      }
    }

    await pool.query('COMMIT');
  }
  catch (error) {
    await pool.query('ROLLBACK');
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "VerifierLogin", error, "updateFCMToken");
    return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error };
  }
}

function generateRandomSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

/** verify vendor */
module.exports.getVendorVerification = async (req) => {
  try {
    if (req.body) {
      const { email_id, verification_code } = req.body;

      const varIDExists = await pool.query(` SELECT COUNT(str_email) AS total FROM mr_store WHERE lower(str_email) =  lower($1) `, [email_id]);
      if (varIDExists && varIDExists.rows.length > 0 && varIDExists.rows[0].total <= 0) {
        return constants.COMMON.EMAIL_NOT_FOUND;
      }

      const varCheckCode = await pool.query(`SELECT str_verification_code AS code FROM mr_store WHERE lower(str_email) =  lower($1) `, [email_id]);
      if (varCheckCode && varCheckCode.rows.length > 0 && varCheckCode.rows[0].code != verification_code) {
        return constants.COMMON.INVALID_CODE;
      }
      const varCheckValidTime = await pool.query(`SELECT CASE WHEN str_verification_sent + INTERVAL '5 minutes' >= CURRENT_TIMESTAMP THEN 1 ELSE 0 END AS editflag FROM mr_store WHERE lower(str_email) =  lower($1)`, [email_id]);
      if (varCheckValidTime && varCheckValidTime.rowCount > 0 && varCheckValidTime.rows[0].editflag == 0) {
        return constants.COMMON.TIME_OUT_CODE;
      }

      return { ...constants.COMMON.VERIFICATION_SUCCESS };
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Request", error, "getVendorVerification");
    return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error }
  }
}
/** send verification code to customer email */
module.exports.setVendorVerificationCode = async (req) => {
  try {
    if (req.body) {
      const { email_id } = req.body;
      const varIDExists = await pool.query(` SELECT COUNT(str_email) AS total,str_contact_no AS mobile_no FROM mr_store WHERE LOWER(str_email)= lower($1) GROUP BY str_contact_no`, [email_id.toLowerCase()]);
      if (varIDExists && varIDExists.rows.length > 0 && varIDExists.rows[0].total <= 0) {
        return constants.COMMON.EMAIL_NOT_FOUND;
      }
      if (email_id.toLowerCase() === process.env.DEFAULT_EMAIL.toLowerCase()) {
        return { ...constants.COMMON.REQUEST_CODE_TO_MAIL, is_default_user: 1 };
      }
      const varRandomNumber = generateRandomSixDigitNumber();
      udfnSendMail(email_id, varRandomNumber);
      await pool.query('BEGIN');
      await pool.query(`UPDATE mr_store SET str_verification_sent = CURRENT_TIMESTAMP, str_verification_code = $2 WHERE LOWER(str_email) =  lower($1)`, [email_id, varRandomNumber]);
      await pool.query('COMMIT')
      return { ...constants.COMMON.REQUEST_CODE_TO_MAIL, is_default_user: 0 };
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Request", error, "setVendorVerificationCode");
    return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error }
  }
}

const udfnSendMail = async (varEmail, varRandomNumber) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        // eslint-disable-next-line no-undef
        user: process.env.FROM_EMAIL,
        // eslint-disable-next-line no-undef
        pass: process.env.PASSKEY,
      },
       tls: {
        rejectUnauthorized: false   // <-- FIX
      }
    });
    const varHtmlText = await udfnGetHtmlText(varRandomNumber);
    const mailOptions = {
      // eslint-disable-next-line no-undef
      from: process.env.FROM_EMAIL,
      to: varEmail,
      subject: 'Verification Code - ' + varRandomNumber,
      text: varHtmlText,
      html: varHtmlText,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Vendor Login", error, "udfnSendMail_request");
      }
    });
  } catch (error) {
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Vendor Login", error, "udfnSendMail_request");
  }
};

const udfnGetHtmlText = async (varVerificationCode) => {
  try {
    const varHtmlText = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verification Code</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border: 1px solid #dddddd;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #eeeeee;
        }
        .email-header h1 {
          font-size: 24px;
          color: #333333;
          margin: 0;
        }
        .email-content {
          margin: 20px 0;
          text-align: center;
          color: #555555;
        }
        .email-content p {
          font-size: 16px;
          line-height: 1.5;
          margin: 10px 0;
        }
        .email-button {
          margin: 20px 0;
          text-align: center;
        }
        .email-button a {
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 25px;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
        }
        .email-footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #aaaaaa;
        }
        .email-footer a {
          color: #007bff;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>Verification Code</h1>
        </div>
        <div class="email-content">
          <p>Hello,</p>
          <p>Verification Code: `+ varVerificationCode + `</p>
        </div>
        <div class="email-content">
          <p>This code is valid for 5 minutes. For security purposes, do not share this code with anyone.</p>
        </div>
        <div class="email-footer">
          <p>If you did not request this verification code, please contact our support team immediately at</p>
          <p>&copy; 2025 Trios. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
    return varHtmlText;
  }
  catch (error) {
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Verifier Master", error, "setVerifier");
    return "";
  }
}


