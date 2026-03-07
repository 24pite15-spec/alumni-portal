  /** POST Methods */  

/**
 * @swagger
 * tags:
 *   name: Verifier 
 *   description: Verifier master
 * /api/verifier/setVerifier:
 *   post:
 *     summary: Save Verifier
 *     tags: [Verifier]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -verifier_name
 *              -mobile_no
 *              -store_id
 *              -email
 *              -status_id
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                verifier_name:
*                    type: string
*                mobile_no:
*                   type: string
*                store_id:
*                   type: array
*                email:
*                   type: string
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
*   name: Verifier
*   description: Verifier master
* /api/verifier/updateVerifier:
*   post:
*     summary: Update Verifier
*     tags: [Verifier]
*     requestBody:
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
 *              -user_id
 *              -user_name
 *              -verifier_id
 *              -verifier_name
 *              -mobile_no
 *              -store_id
 *              -email
 *              -status_id
*             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                verifier_id:
*                    type: integer
*                verifier_name:
*                    type: string
*                mobile_no:
*                   type: string
*                store_id:
*                   type: array
*                email:
*                   type: string
*                status_id:
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
*                 message:
*                    type: string
*                 data:
*                   type: array   
*/

 /**
 * @swagger
 * tags:
 *   name: Verifier 
 *   description: Verifier master
 * /api/verifier/deleteVerifier:
 *   post:
 *     summary: Delete Verifier
 *     tags: [Verifier]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -verifier_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               verifier_id:
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
 *   name: Verifier 
 *   description: Verifier master
 * /api/verifier/getVerifierList:
 *   post:
 *     summary: Verifier list
 *     tags: [Verifier]
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
 *         description: Return Verifier List
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
 *   name: Verifier 
 *   description: Verifier master
 * /api/verifier/getVerifierDetails:
 *   post:
 *     summary: Verifier details
 *     tags: [Verifier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - verifier_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               verifier_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return Model Details
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
 *   name: Verifier 
 *   description: Reset Password
 * /api/verifier/resetPassword:
 *   post:
 *     summary: Reset password
 *     tags: [Verifier]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -verifier_id
 *              -new_password
 *             properties:
 *               verifier_id:
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

/**
 * @swagger
 * tags:
 *   name: Verifier 
 *   description: get verifier details from link
 * /api/verifier/verificationEmail:
 *   post:
 *     summary: get verifier details from link
 *     tags: [Verifier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - verifier_id
 *               - is_forgot_pwd
 *             properties:
 *               verifier_id:
 *                 type: string
 *               is_forgot_pwd:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return Model Details
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
 *   name: Verifier 
 *   description: Verifier master
 * /api/verifier/setForgotPassword:
 *   post:
 *     summary: Save Verifier
 *     tags: [Verifier]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *              -email 
 *             properties: 
*                email:
*                   type: string
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
 *   name: Verifier 
 *   description: Update FCM Token
 * /api/verifier/updateFCMToken:
 *   post:
 *     summary: Update FCM Token
 *     tags: [Verifier]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *              -verifier_id
 *              -fcm_token 
 *             properties: 
*                verifier_id:
*                   type: number
*                fcm_token:
*                   type: string
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