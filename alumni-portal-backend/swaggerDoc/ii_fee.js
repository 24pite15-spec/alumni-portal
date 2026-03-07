  /** POST Methods */  

/**
 * @swagger
 * tags:
 *   name: Fee
 *   description: Fee master
 * /api/fee/setFee:
 *   post:
 *     summary: Save Fee
 *     tags: [Fee]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -fee_name
 *              -tax_id
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                fee_name:
*                    type: string
*                tax_id:
*                   type: integer
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
*   name: Fee
*   description: Fee master
* /api/fee/updateFee:
*   post:
*     summary: Update Fee
*     tags: [Fee]
*     requestBody:
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*              - user_id
*              - user_name
*              - fee_id
*              - fee_name
*              - tax_id
*              - fee_status
*             properties:
*               user_id:
*                 type: integer
*               user_name:
*                 type: string
*               fee_id:
*                 type: integer
*               fee_name:
*                 type: string
*               tax_id:
*                 type: integer
*               fee_status:
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
*                
*/

 /**
 * @swagger
 * tags:
 *   name: Fee 
 *   description: Fee master
 * /api/fee/deleteFee:
 *   post:
 *     summary: Delete Fee
 *     tags: [Fee]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -fee_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               fee_id:
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
 *                
 */

/**
 * @swagger
 * tags:
 *   name: Fee 
 *   description: Fee master
 * /api/fee/getFeeList:
 *   post:
 *     summary: Fee list
 *     tags: [Fee]
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
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               order_flag:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return Category List
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
 *   name: Fee 
 *   description: Fee master
 * /api/fee/getFeeDetails:
 *   post:
 *     summary: Fee details
 *     tags: [Fee]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - fee_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               fee_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return Category Details
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

