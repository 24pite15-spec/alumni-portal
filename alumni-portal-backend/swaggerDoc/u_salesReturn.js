/**
 * @swagger
 * tags:
 *   name: Sales Return
 *   description: Sales Return
 * /api/salesReturn/getSalesReturnNo:
 *   post:
 *     summary: getSalesReturnNo
 *     tags: [Sales Return]
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
 *   name: Sales Return
 *   description: Get Sales Return Vendor List
 * /api/salesReturn/getSalesReturnVendorList:
 *   post:
 *     summary: getSalesReturnVendorList
 *     tags: [Sales Return]
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
 *   name: Sales Return
 *   description: SalesReturn Return
 * /api/salesReturn/getSalesReturnIMEI:
 *   post:
 *     summary: getSalesReturnIMEI
 *     tags: [Sales Return]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -vendor_id
 *              -imei_no
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                vendor_id:
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
 *   name: Sales Return
 *   description: SalesReturn 
 * /api/salesReturn/setSalesReturn:
 *   post:
 *     summary: setSalesReturn
 *     tags: [Sales Return]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -vendor_id
 *              -trans_date
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
*                vendor_id:
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
 *   name: Sales Return
 *   description: SalesReturn 
 * /api/salesReturn/updateSalesReturn:
 *   post:
 *     summary: updateSalesReturn
 *     tags: [Sales Return]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -vendor_id
 *              -trans_date
 *              -total_amount
 *              -remarks
 *              -imei_list
 *              -trans_no
 *              -imei_count
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                trans_no:
*                    type: integer
*                vendor_id:
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
 *   name: Sales Return
 *   description: SalesReturn 
 * /api/salesReturn/deleteSalesReturn:
 *   post:
 *     summary: deleteSalesReturn
 *     tags: [Sales Return]
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
 *   name: Sales Return
 *   description: getSalesReturnList
 * /api/salesReturn/getSalesReturnList:
 *   post:
 *     summary: getSalesReturnList
 *     tags: [Sales Return]
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
 *               - to_date
 *               - search_value
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
 *               search_value:
 *                 type: string
 *               status_code:
 *                 type: integer
 *               limit:
 *                 type: integer
 *               offset:
 *                 type: integer  
 *     responses:
 *       200:
 *         description: Returns sales List
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
 *   name: Sales Return
 *   description: SalesReturn
 * /api/salesReturn/getSalesReturnDetails:
 *   post:
 *     summary: getSalesReturnDetails
 *     tags: [Sales Return]
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
 *         description: Returns Sales Return List
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
 *   name: Sales Return
 *   description: SalesReturn
 * /api/salesReturn/updateSalesReturnStatus:
 *   post:
 *     summary: updateSalesReturnStatus
 *     tags: [Sales Return]
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
 *   name: Sales Return
 *   description: Sales Return
 * /api/salesReturn/updateSalesReturnCancel:
 *   post:
 *     summary: updateSalesReturnCancel
 *     tags: [Sales Return]
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
 *         description: Returns 
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
