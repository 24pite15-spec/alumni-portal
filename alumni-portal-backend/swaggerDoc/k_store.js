/**
 * @swagger
 * tags:
 *   name: Store
 *   description: Store master
 * /api/store/setStore:
 *   post:
 *     summary: Save Store
 *     tags: [Store]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - store_name
 *               - contact_person
 *               - contact_no
 *               - email
 *               - address
 *               - city
 *               - gst
 *               - password
 *             properties:
 *               store_name:
 *                 type: string
 *               contact_person:
 *                 type: string
 *               contact_no:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               gst:
 *                 type: string
 *               password:
 *                 type: string
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
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     store_id:
 *                       type: integer
 */

/**
 * @swagger
 * tags:
 *   name: Store
 *   description: Store master
 * /api/store/updateStore:
 *   post:
 *     summary: Update Store
 *     tags: [Store]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - store_id
 *               - partner_id
 *               - status_id
 *               - reject_reason 
 *               - store_name
 *               - contact_person
 *               - contact_no
 *               - email
 *               - address
 *               - city 
 *               - gst
 *               - show_newdevice_details
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               store_id:
 *                 type: integer
 *               partner_id:
 *                 type: integer
 *               status_id:
 *                 type: integer
 *               reject_reason:
 *                 type: string 
 *               store_name:
 *                 type: string
 *               contact_person:
 *                 type: string
 *               contact_no:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string 
 *               gst:
 *                 type: string
 *               show_newdevice_details:
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
 *                   type: integer
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * tags:
 *   name: Store
 *   description: Store master
 * /api/store/deleteStore:
 *   post:
 *     summary: Delete Store
 *     tags: [Store]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - store_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               store_id:
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
 *                   type: integer
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * tags:
 *   name: Store
 *   description: Store master
 * /api/store/getStoreList:
 *   post:
 *     summary: Store list
 *     tags: [Store]
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
 *               - is_partner
 *               - partner_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               order_flag:
 *                 type: integer
 *               source:
 *                 type: integer
 *               is_partner:
 *                 type: integer
 *               partner_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return Store List
 *         content:
 *           application/json:
 *             schema:
 *               type: object 
 *               properties:
 *                 status:
 *                   type: integer
 *                 successcode:
 *                   type: integer
 *                 data:
 *                   type: array
 */

/**
 * @swagger
 * tags:
 *   name: Store
 *   description: Store master
 * /api/store/getStoreDetails:
 *   post:
 *     summary: Store details
 *     tags: [Store]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - store_id
 *               - is_partner
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               store_id:
 *                 type: integer
 *               is_partner:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return Store Details
 *         content:
 *           application/json:
 *             schema:
 *               type: object 
 *               properties:
 *                 status:
 *                   type: integer
 *                 successcode:
 *                   type: integer
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * tags:
 *   name: Store
 *   description: Reset Password
 * /api/store/resetPassword:
 *   post:
 *     summary: Reset password
 *     tags: [Store]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -store_id
 *              -new_password
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               store_id:
 *                  type: integer
 *               new_password:
 *                  type: string
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

