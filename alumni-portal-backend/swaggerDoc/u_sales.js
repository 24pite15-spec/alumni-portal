/**
 * @swagger
 * tags:
 *   name: Sales 
 *   description: Sales 
 * /api/sales/getSalesOrderNo:
 *   post:
 *     summary: getSalesOrderNo
 *     tags: [Sales]
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
 *   name: Sales
 *   description: Purchase
 * /api/sales/getSalesVendorList:
 *   post:
 *     summary: getSalesVendorList
 *     tags: [Sales]
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
 *   name: Sales
 *   description: Sales
 * /api/sales/getSalesIMEI:
 *   post:
 *     summary: getSalesIMEI
 *     tags: [Sales]
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
 *   name: Sales
 *   description: Sales 
 * /api/sales/setSales:
 *   post:
 *     summary: setSales
 *     tags: [Sales]
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
 *              -total_tradein_amount
 *              -total_fee
 *              -total_amount
 *              -remarks
 *              -imei_list
 *              -fyid
 *              -imei_count
 *              -fee_list
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                vendor_id:
*                   type: integer
*                trans_date:
*                    type: string
*                total_tradein_amount:
*                    type: integer
*                total_fee:
*                    type: integer
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
*                fee_list:
*                    type: array
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
 *   name: Sales
 *   description: Sales 
 * /api/sales/updateSales:
 *   post:
 *     summary: updateSales
 *     tags: [Sales]
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
 *              -total_tradein_amount
 *              -total_fee
 *              -total_amount
 *              -remarks
 *              -imei_list
 *              -trans_no
 *              -imei_count
 *              -fee_list
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
*                total_tradein_amount:
*                    type: integer
*                total_fee:
*                    type: integer
*                total_amount:
*                    type: integer
*                remarks:
*                    type: string
*                imei_list:
*                    type: array
*                imei_count:
*                    type: integer
*                fee_list:
*                    type: array
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
 *   name: Sales
 *   description: Sales 
 * /api/sales/deleteSales:
 *   post:
 *     summary: deleteSales
 *     tags: [Sales]
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
 *   name: Sales
 *   description: getSalesList
 * /api/sales/getSalesList:
 *   post:
 *     summary: getSalesList
 *     tags: [Sales]
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
 *   name: Sales
 *   description: Sales
 * /api/sales/getSalesDetails:
 *   post:
 *     summary: getSalesDetails
 *     tags: [Sales]
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
 *         description: Returns Sales List
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
 *   name: Sales
 *   description: Sales
 * /api/sales/updateSalesStatus:
 *   post:
 *     summary: updateSalesStatus
 *     tags: [Sales]
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
 *   name: Sales
 *   description: Purchase
 * /api/sales/updateSalesCancel:
 *   post:
 *     summary: updateSalesCancel
 *     tags: [Sales]
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
 *   name: Sales
 *   description: getSalesList
 * /api/sales/getSalesInvoiceList:
 *   post:
 *     summary: getSalesInvoiceList
 *     tags: [Sales]
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
 *               - limit
 *               - offset
 *               - status_code
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
 *               limit:
 *                 type: integer
 *               offset:
 *                 type: integer  
 *               status_code:
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