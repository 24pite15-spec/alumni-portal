/**
 * @swagger
 * tags:
 *   name: Purchase Order 
 *   description: Purchase Order
 * /api/purchaseorder/getPOOrderNo:
 *   post:
 *     summary: getPOOrderNo
 *     tags: [Purchase Order]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -fyid
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                fyid:
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
 *   name: Purchase Order 
 *   description: Purchase Order
 * /api/purchaseorder/getPartnerList:
 *   post:
 *     summary: getPartnerList
 *     tags: [Purchase Order]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
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
 *   name: Purchase Order 
 *   description: Purchase Order
 * /api/purchaseorder/getPartnerIMEI:
 *   post:
 *     summary: getPartnerIMEI
 *     tags: [Purchase Order]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -partner_id
 *              -imei_no
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                partner_id:
*                   type: integer
*                imei_no:
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
 *   name: Purchase Order 
 *   description: Purchase Order
 * /api/purchaseorder/setPurchaseOrder:
 *   post:
 *     summary: setPurchaseOrder
 *     tags: [Purchase Order]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -partner_id
 *              -po_date
 *              -total_amount
 *              -remarks
 *              -imei_list
 *              -fyid
 *              -imei_count
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                partner_id:
*                   type: integer
*                po_date:
*                    type: string
*                total_amount:
*                    type: integer
*                remarks:
*                    type: string
*                imei_list:
*                    type: array
*                fyid:
*                    type: integer
*                imei_count:
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
 *   name: Purchase Order 
 *   description: Purchase Order
 * /api/purchaseorder/updatePurchaseOrder:
 *   post:
 *     summary: updatePurchaseOrder
 *     tags: [Purchase Order]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -trans_no
 *              -partner_id
 *              -po_date
 *              -total_amount
 *              -remarks
 *              -imei_list
 *              -imei_count
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                trans_no:
*                    type: integer
*                partner_id:
*                   type: integer
*                po_date:
*                    type: string
*                total_amount:
*                    type: integer
*                remarks:
*                    type: string
*                imei_list:
*                    type: array
*                imei_count:
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
 *   name: Purchase Order 
 *   description: Purchase Order
 * /api/purchaseorder/deletePurchaseOrder:
 *   post:
 *     summary: deletePurchaseOrder
 *     tags: [Purchase Order]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -trans_no
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                trans_no:
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
 *   name: Purchase Order 
 *   description: Purchase Order
 * /api/purchaseorder/getPurchaseOrderList:
 *   post:
 *     summary: Purchase Order list
 *     tags: [Purchase Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - from_date
 *               - to_date_date
 *               - partner_id
 *               - status_code
 *               - limit
 *               - offset
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               from_date:
 *                 type: string
 *               to_date:
 *                 type: string
 *               partner_id:
 *                 type: integer
 *               status_code:
 *                 type: integer
 *               limit:
 *                 type: integer
 *               offset:
 *                 type: integer  
 *     responses:
 *       200:
 *         description: Returns Purchase Order List
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
 *   name: Purchase Order 
 *   description: Purchase Order
 * /api/purchaseorder/getPurchaseOrderDetails:
 *   post:
 *     summary: Purchase Order list
 *     tags: [Purchase Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - trans_no
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               trans_no:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Returns Purchase Order List
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
 *   name: Purchase Order 
 *   description: Purchase Order
 * /api/purchaseorder/updatePurchaseOrderStatus:
 *   post:
 *     summary: updatePurchaseOrderStatus
 *     tags: [Purchase Order]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -trans_no
 *              -status_code
 *              -remarks
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                trans_no:
*                    type: integer
*                status_code:
*                   type: integer
*                remarks:
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
