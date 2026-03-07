const ErrorLogMgmtService = require('../../service/ErrorLogMgmtService');

//Create Consultation JWt Module
module.exports.errorLog = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ErrorLogMgmtService.errorLog(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

module.exports.errorlogInfo = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ErrorLogMgmtService.errorlogInfo(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}