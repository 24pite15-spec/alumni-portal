/** Author : Sathish
 *  Created Date : 23 Dec 2024
 *  Description  : Brand master schema
 */
const Joi = require('joi');

module.exports.setBrand = Joi.object().keys({
  user_id: Joi.number().required(),
  user_name: Joi.string().required(),
  category_id: Joi.number().required(),
  brand_name: Joi.string().max(50).required()
});

module.exports.updateBrand = Joi.object().keys({
  user_id: Joi.number().required(),
  user_name: Joi.string().required(),
  category_id: Joi.number().required(),
  brand_id: Joi.number().required(),
  brand_name: Joi.string().max(50).required()
});

module.exports.deleteBrand = Joi.object().keys({
  user_id: Joi.number().required(),
  user_name: Joi.string().required(),
  brand_id: Joi.number().required()
});

module.exports.getBrandList = Joi.object().keys({
  user_id: Joi.number().required(),
  user_name: Joi.string().required(),
  order_flag: Joi.number(),
  source: Joi.number().required(),
  is_partner: Joi.number().required()

});

module.exports.getBrandDetails = Joi.object().keys({
  user_id: Joi.number().required(),
  user_name: Joi.string().required(),
  brand_id: Joi.number().required()
});