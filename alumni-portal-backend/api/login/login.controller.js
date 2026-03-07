const LoginMgmtService = require('../../service/LoginMgmtService');
const CommonService = require('../../service/commonService');

//Login User Module
module.exports.refreshToken = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await CommonService.refreshToken(req.body);
        if (responseFromService) {
            response = responseFromService;
        }
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Login User Module
module.exports.login = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LoginMgmtService.login(req.body,res);
        if (responseFromService) {
            response = responseFromService;
        }

    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Login Vendor Module
module.exports.vendorLogin = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LoginMgmtService.vendorLogin(req.body,res);
        if (responseFromService) {
            response = responseFromService;
        }
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Login Verifier Module
module.exports.verifierLogin = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LoginMgmtService.verifierLogin(req.body,res);
        if (responseFromService) {
            response = responseFromService;
        }
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Vendor Verification Code
module.exports.setVendorVerificationCode = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LoginMgmtService.setVendorVerificationCode(req);
        if (responseFromService) {
            response = responseFromService;
        }
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Vendor Verification
module.exports.getVendorVerification = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LoginMgmtService.getVendorVerification(req);
        if (responseFromService) {
            response = responseFromService;
        }
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

