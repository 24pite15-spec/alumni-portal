/** Author : Sathish
 *  Created Date : 23 Dec 2024
 *  Description  : Brand master controller
 */
const brandService = require('../../../service/master/brandService');

/** Save Brand details */
module.exports.setBrand = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await brandService.setBrand(req);
        if (responseFromService) {
            response = responseFromService;
        }
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
/** Update Brand details */
module.exports.updateBrand = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await brandService.updateBrand(req);
        if (responseFromService) {
            response = responseFromService;
        }
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

/** Delete Brand details */
module.exports.deleteBrand = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await brandService.deleteBrand(req);
        if (responseFromService) {
            response = responseFromService;
        }
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

/** Brand List */
module.exports.getBrandList = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await brandService.getBrandList(req);
        if (responseFromService) {
            response = responseFromService;
        }
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

/** Brand Editload */
module.exports.getBrandDetails = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await brandService.getBrandDetails(req);
        if (responseFromService) {
            response = responseFromService;
        }
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}