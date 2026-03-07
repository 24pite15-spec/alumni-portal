  /** POST Methods */  

/**
 * @swagger
 * tags:
 *   name: SKU Pricing 
 *   description: SKU Pricing List
 * /api/skuPricing/getSKUPricingList:
 *   post:
 *     summary: SKU Pricing list
 *     tags: [SKU Pricing]
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
 *               - category_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               partner_id:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return SKU Pricing List
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
 *   name: SKU Pricing 
 *   description: SKU Pricing List
 * /api/skuPricing/updateSKUPricing:
 *   post:
 *     summary: SKU Pricing
 *     tags: [SKU Pricing]
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
 *               - category_id
 *               - price_details
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               partner_id:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               price_details:
 *                 type: array
 *     responses:
 *       200:
 *         description: Return Success statement
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
