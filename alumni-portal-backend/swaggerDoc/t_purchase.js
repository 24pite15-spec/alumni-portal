/**
 * @swagger
 * tags:
 *   name: Purchase 
 *   description: Purchase 
 * /api/purchase/getPurchaseOrderNo:
 *   post:
 *     summary: getPurchaseOrderNo
 *     tags: [Purchase ]
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
 *   name: Purchase 
 *   description: Purchase
 * /api/purchase/getPurchasePartnerList:
 *   post:
 *     summary: getPurchasePartnerList
 *     tags: [Purchase]
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
 *   name: Purchase 
 *   description: Purchase
 * /api/purchase/getPurchaseIMEI:
 *   post:
 *     summary: getPurchaseIMEI
 *     tags: [Purchase]
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
 *   name: Purchase 
 *   description: Purchase 
 * /api/purchase/setPurchase:
 *   post:
 *     summary: setPurchase
 *     tags: [Purchase]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -partner_id
 *              -trans_date
 *              -total_amount
 *              -remarks
 *              -imei_list
 *              -fyid
 *              -imei_count
 *              -invoice_file_name
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                partner_id:
*                   type: integer
*                trans_date:
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
*                invoice_file_name:
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
 *   name: Purchase 
 *   description: Purchase 
 * /api/purchase/updatePurchase:
 *   post:
 *     summary: updatePurchase
 *     tags: [Purchase]
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
 *              -trans_date
 *              -total_amount
 *              -remarks
 *              -imei_list
 *              -imei_count
 *              -invoice_file_name
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                trans_no:
*                   type: integer
*                partner_id:
*                   type: integer
*                trans_date:
*                    type: string
*                total_amount:
*                    type: integer
*                remarks:
*                    type: string
*                imei_list:
*                    type: array
*                imei_count:
*                    type: integer
*                invoice_file_name:
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
 *   name: Purchase 
 *   description: Purchase 
 * /api/purchase/deletePurchase:
 *   post:
 *     summary: deletePurchase
 *     tags: [Purchase]
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
 *   name: Purchase 
 *   description: Purchase
 * /api/purchase/getPurchaseList:
 *   post:
 *     summary: Purchase list
 *     tags: [Purchase]
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
 *               - search_value
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
 *               search_value:
 *                 type: string
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
 *   name: Purchase 
 *   description: Purchase
 * /api/purchase/getPurchaseDetails:
 *   post:
 *     summary: Purchase list
 *     tags: [Purchase]
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
 *         description: Returns Purchase List
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
 *   name: Purchase 
 *   description: Purchase
 * /api/purchase/updatePurchaseStatus:
 *   post:
 *     summary: updatePurchaseStatus
 *     tags: [Purchase]
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
 *               - status_code
 *               - remarks
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               trans_no:
 *                 type: integer
 *               status_code:
 *                 type: integer
 *               remarks:
 *                 type: string  
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
 *   name: Purchase 
 *   description: Purchase
 * /api/purchase/updatePurchaseCancel:
 *   post:
 *     summary: updatePurchaseCancel
 *     tags: [Purchase]
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
 *               - status_code
 *               - remarks
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               trans_no:
 *                 type: integer
 *               status_code:
 *                 type: integer
 *               remarks:
 *                 type: string  
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
