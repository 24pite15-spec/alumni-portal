  /** POST Methods */  

/**
 * @swagger
 * tags:
 *   name: Partner 
 *   description: Partner master
 * /api/partner/setPartner:
 *   post:
 *     summary: Save Partner
 *     tags: [Partner]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -partner_name
 *              -contact_person
 *              -email
 *              -contact_no
 *              -address
 *              -state
 *              -city
 *              -password
 *              -gst
 *              -pan
 *              -bank_name
 *              -account_no
 *              -ifsc
 *              -apple_id
 *              -docs
 *             properties:
*                partner_name:
*                   type: string
*                contact_person:
*                    type: string
*                email:
*                    type: string
*                contact_no:
*                    type: string
*                address:
*                    type: string
*                state:
*                    type: string
*                city:
*                    type: string
*                password:
*                    type: string
*                gst:
*                    type: string
*                pan:
*                    type: string
*                bank_name:
*                    type: string
*                account_no:
*                    type: string
*                ifsc:
*                    type: string
*                apple_id:
*                    type: string
*                docs:
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
*   name: Partner
*   description: Partner master
* /api/partner/updatePartner:
*   post:
*     summary: Update Partner
*     tags: [Partner]
*     requestBody:
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*              - user_id
*              - user_name
*              - partner_id
*              - status_id
*              - commission
*              - reject_reason
*             properties:
*               user_id:
*                 type: integer
*               user_name:
*                 type: string
*               partner_id:
*                 type: integer
*               status_id:
*                 type: integer
*               commission:
*                 type: string
*               reject_reason:
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
 *   name: Partner 
 *   description: Partner master
 * /api/partner/deletePartner:
 *   post:
 *     summary: Delete Partner
 *     tags: [Partner]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -partner_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               partner_id:
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
 *   name: Partner 
 *   description: Partner master
 * /api/partner/getPartnerList:
 *   post:
 *     summary: Partner list
 *     tags: [Partner]
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
 *         description: Return Brand List
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
 *   name: Partner 
 *   description: Partner master
 * /api/partner/getPartnerDetails:
 *   post:
 *     summary: Partner details
 *     tags: [Partner]
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
 *         description: Return Partner Details
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
 *   name: Partner 
 *   description: Reset Password
 * /api/partner/resetPassword:
 *   post:
 *     summary: Reset password
 *     tags: [Partner]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -partner_id
 *              -new_password
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               partner_id:
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
