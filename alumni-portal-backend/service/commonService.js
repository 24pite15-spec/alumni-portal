
/* eslint-disable no-undef */
const constants = require('../constants');
const jwt = require('jsonwebtoken');
const pool = require('../database/connection');
const errorlogService = require('../service/ErrorLogMgmtService')
var CryptoJS = require("crypto-js");
let refreshTokens = [];
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const SECRET_KEY = process.env.SECRET_KEY
const axios = require('axios');
const dns = require('dns');

//Verify JWT Token
module.exports.jwtVerify = async function (jwtToken) {
  try {
    const token = jwtToken.trim();
    const decoded = jwt.verify(token, SECRET_KEY || '');
    return decoded;
  } catch (error) {
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Common-Service", error, "jwtVerify");
    throw new Error(error);
  }
}

//Create JWT Token 
module.exports.jwtCreate = async function (data) {
  try {
    const token = jwt.sign({ data }, SECRET_KEY || '', { expiresIn: '3h' });
    return token;
  } catch (error) {
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Common-Service", error, "jwtCreate");
    throw new Error(error);
  }
}

//insert userlog 
module.exports.insertLogs = async function (data) {

  try {
    const log = await pool.query(`SELECT COALESCE(max(logid),0)+1 as logid FROM trn_user_log`);

    const result = await pool.query(`INSERT INTO "trn_user_log"("log_orginator","logid","log_userid","log_createddate") values ($1, $2,$3, CURRENT_TIMESTAMP) RETURNING "logid"  `,
      [data.originator, log.rows[0].logid, data.userId]);
    return result.rows[0].logid;
  } catch (error) {
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Common-Service", 'Something went wrong: Service: insertLogs' + error, "insertLogs");
    throw new Error(error);
  }
}

//Decrypt password
module.exports.encryptpassword = async function ({ pwd }) {
  try {
    var ciphertext = CryptoJS.AES.encrypt(pwd, 'Faj72534klM').toString(); //Here second param is secret key
    return ciphertext;
  } catch (error) {
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Common-Service", error, "encryptpassword");
    throw new Error(error);
  }
}


//Encrypt password
module.exports.decryptpassword = async function ({ pwd }) {
  try {
    var bytes = CryptoJS.AES.decrypt(pwd, 'Faj72534klM');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (error) {
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Common-Service", error, "decryptpassword");
    throw new Error(error);
  }
}

//Check UserID  
module.exports.checkUserId = async function (req) {
  try {
    const { user_id, user_name } = req;
    const result = await pool.query(`SELECT COUNT(usid) FROM "mr_users" WHERE "usid" = $1 AND LOWER(us_name)  = $2`, [user_id, user_name.trim().toLowerCase()]);
    let count = result && result.rows[0] && result.rows[0].count ? Number(result.rows[0].count) : 0;
    return count;
  } catch (error) {
    throw new Error(error);
  }
}

//Check Partner UserID  
module.exports.checkPartnerUserId = async function (req) {
  try {
    const { user_id, user_name } = req;
    const result = await pool.query(`SELECT COUNT(prid) FROM "mr_partner" WHERE "prid" = $1 AND LOWER(pr_email)  = LOWER($2)`, [user_id, user_name.trim().toLowerCase()]);
    let count = result && result.rows[0] && result.rows[0].count ? Number(result.rows[0].count) : 0;
    return count;
  } catch (error) {
    throw new Error(error);
  }
}

//Vendor Check UserID  
module.exports.vendorCheckUserId = async function (req) {
  try {
    const { user_id, user_name } = req;
    const result = await pool.query(`SELECT COUNT(strid) FROM "mr_store" WHERE "strid" = $1 AND LOWER(str_email)  = $2`, [user_id, user_name.trim().toLowerCase()]);
    let count = result && result.rows[0] && result.rows[0].count ? Number(result.rows[0].count) : 0;
    return count;
  } catch (error) {
    throw new Error(error);
  }
}

//Verifier Check UserID  
module.exports.verifierCheckUserId = async function (req) {
  try {
    const { user_id, user_name } = req;
    const result = await pool.query(`SELECT COUNT(vrid) FROM "mr_verifier" WHERE "vrid" = $1 AND LOWER(vr_email)  = $2`, [user_id, user_name.trim().toLowerCase()]);
    let count = result && result.rows[0] && result.rows[0].count ? Number(result.rows[0].count) : 0;
    return count;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports.generateAccessToken = async function ({ user }) {
  try {
    let val = jwt.sign({ user: user }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    return val;
  } catch (error) {
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Common-Service", error, "encryptpassword");
    throw new Error(error);
  }
}
module.exports.generateRefreshToken = async function ({ user }) {
  try {
    const refreshToken = jwt.sign({ user: user }, REFRESH_TOKEN_SECRET, { expiresIn: '24h' });
    refreshTokens.push(refreshToken)
    return refreshToken;
  } catch (error) {
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Common-Service", error, "encryptpassword");
    throw new Error(error);
  }
}
module.exports.getStoredRefreshToken = async function () {
  return refreshTokens;
}
module.exports.validateToken = async function (req) {
  try {
    const authHeader = req.headers["authorization"];
    let decoded = '';
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token == null) return "";  //Token not present
      decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    }
    return decoded;
  }
  catch (error) {
    return false;
  }
}

module.exports.refreshToken = async (req) => {
  try {
    const storedRefreshToken = await this.getStoredRefreshToken();
    // (req);
    var getRefreshToken = req.token;
    var response = {}
    const getToken = getRefreshToken?.trim();

    if (!getToken) {
      response = { "message": "Refresh token not provided", "status": '498' };
      return { "tokenResult": response };
    }
    const decoded = jwt.verify(getToken, REFRESH_TOKEN_SECRET);
    if (decoded) {
      if (!storedRefreshToken.includes(getToken)) {
        response = { "message": "Invalid token", "status": '498' };
        return { "tokenReult": response };
      }
      else {
        refreshTokens = storedRefreshToken.filter((c) => c != getToken);
        //remove the old refreshToken from the refreshTokens list
        const accessToken = await this.generateAccessToken({ user: req.user });
        const refreshToken = await this.generateRefreshToken({ user: req.user });
        response = { "message": "Success", "status": "200", access_token: accessToken, refresh_token: refreshToken };
        return { "tokenReult": response };

      }
    }
  }
  catch (error) {
    await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "refersh token", error, "refreshtoken");
    if (error.name === 'TokenExpiredError') {
      response = { "tokenReult": { "message": "Token Expired", "status": '498' } };
      return response
    } else {
      throw new Error(error);
    }
  }
}







