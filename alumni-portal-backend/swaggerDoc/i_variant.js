  /** POST Methods */  

/**
 * @swagger
 * tags:
 *   name: Variant 
 *   description: Variant master
 * /api/variant/setVariant:
 *   post:
 *     summary: Save Variant
 *     tags: [Variant]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -model_id
 *              -variant_name  
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                model_id:
*                   type: integer
*                variant_name:
*                    type: string
 *     responses:
 *       200:
 *         description: Return success statement
 *         content:
 *           application/json:
 *             schema:
 *               type: object 
 *               properties:
 *                 status:
 *                   type: integer
 *                 successcode:
 *                    type: integer
 *                 data:
 *                   type: array
 */


/**
* @swagger
* tags:
*   name: Variant
*   description: Variant master
* /api/variant/updateVariant:
*   post:
*     summary: Update Variant
*     tags: [Variant]
*     requestBody:
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*              - user_id
*              - user_name
*              - variant_id
*              - variant_name
*              - model_id
*              - status_id
*             properties:
*               user_id:
*                 type: integer
*               user_name:
*                 type: string
*               variant_id:
*                 type: integer
*               variant_name:
*                 type: string
*               model_id:
*                 type: integer
*               status_id:
*                 type: integer
*     responses:
*       200:
*         description: Return success statement
*         content:
*           application/json:
*             schema:
*               type: object 
*               properties:
*                 status:
*                   type: integer
*                 successcode:
*                    type: integer
*                 message:
*                    type: string
*                 data:
*                   type: array   
*/

 /**
 * @swagger
 * tags:
 *   name: Variant
 *   description: Variant master
 * /api/variant/deleteVariant:
 *   post:
 *     summary: delete Variant
 *     tags: [Variant]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -variant_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               variant_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return delete response
 *         content:
 *           application/json:
 *             schema:
 *               type: object 
 *               properties:
 *                 status:
 *                   type: integer
 *                 successcode:
 *                    type: integer
 *                 message:
 *                    type: string    
 */


/**
 * @swagger
 * tags:
 *   name: Variant 
 *   description: Variant master
 * /api/variant/getVariantList:
 *   post:
 *     summary: Variant list
 *     tags: [Variant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - order_flag
 *               - source
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               order_flag:
 *                 type: integer
 *               source:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return Variant List
 *         content:
 *           application/json:
 *             schema:
 *               type: object 
*               properties:
*                 status:
*                   type: integer
*                 successcode:
*                    type: integer
*                 data:
*                   type: array
 */


/**
 * @swagger
 * tags:
 *   name: Variant 
 *   description: Variant master
 * /api/variant/getVariantDetails:
 *   post:
 *     summary: Variant details
 *     tags: [Variant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - variant_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               variant_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return Variant Details
 *         content:
 *           application/json:
 *             schema:
 *               type: object 
*               properties:
*                 status:
*                   type: integer
*                 successcode:
*                    type: integer
*                 data:
*                   type: array
 */


/**
 * @swagger
 * tags:
 *   name: Variant 
 *   description: Variant Price List
 * /api/variant/getVariantPriceList:
 *   post:
 *     summary: Variant Price List
 *     tags: [Variant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - partner_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               partner_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return Variant Details
 *         content:
 *           application/json:
 *             schema:
 *               type: object 
*               properties:
*                 status:
*                   type: integer
*                 successcode:
*                    type: integer
*                 data:
*                   type: array
 */


