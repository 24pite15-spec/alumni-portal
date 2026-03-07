  /** POST Methods */  
  
/**
 * @swagger
 * tags:
 *   name: Report 
 *   description: Report
 * /api/report/getIMEIBasedPurchase:
 *   post:
 *     summary: List IMEI Based Purchase
 *     tags: [Report]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -from_date
 *              -to_date
 *              -model_id
 *              -imei_no
 *              -limit
 *              -offset
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                from_date:
*                   type: string
*                to_date:
*                    type: string
*                model_id:
*                    type: integer
*                imei_no:
*                    type: string
*                limit:
*                    type: integer
*                offset:
*                    type: integer
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
 *   name: Report 
 *   description: Report
 * /api/report/getIMEIBasedSales:
 *   post:
 *     summary: List IMEI Based Sales
 *     tags: [Report]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -from_date
 *              -to_date
 *              -model_id
 *              -imei_no
 *              -limit
 *              -offset
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                from_date:
*                   type: string
*                to_date:
*                    type: string
*                model_id:
*                    type: integer
*                imei_no:
*                    type: string
*                limit:
*                    type: integer
*                offset:
*                    type: integer
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
