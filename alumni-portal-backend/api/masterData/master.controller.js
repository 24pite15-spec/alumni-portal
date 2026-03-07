const master = require('../../service/masterService');

/** Get status details */
module.exports.getStatusDetails = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await master.getStatusDetails(req);
        if (responseFromService) {
            response = responseFromService;
        }
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
} 
/** Get State details */
module.exports.getStateDetails = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await master.getStateDetails(req);
        if (responseFromService) {
            response = responseFromService;
        }
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
} 

/** Get Reject Reason List */
module.exports.getRejectReasonList = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await master.getRejectReasonList(req);
        if (responseFromService) {
            response = responseFromService;
        }
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
} 

/** Get Tax details */
module.exports.getTaxList = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await master.getTaxList(req);
        if (responseFromService) {
            response = responseFromService;
        }
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

module.exports.getTransactionStatusDetails = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await master.getTransactionStatusDetails(req);
        if (responseFromService) {
            response = responseFromService;
        }
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
} 