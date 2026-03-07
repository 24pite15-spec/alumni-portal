
/** Author : Anusha
 *  Created Date : 25 Dec 2024
 *  Description  : Change password controller
 */
const ChangePasswordService = require('../../service/master/changePasswordService');

/** Login change password */
module.exports.loginChangePassword = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ChangePasswordService.loginChangePassword(req);
        if (responseFromService) {
            response = responseFromService;
        }
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

/** Vendor change password */
module.exports.vendorChangePassword = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ChangePasswordService.vendorChangePassword(req);
        if (responseFromService) {
            response = responseFromService;
        }
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

/** Verifier change password */
module.exports.verifierChangePassword = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ChangePasswordService.verifierChangePassword(req);
        if (responseFromService) {
            response = responseFromService;
        }
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}