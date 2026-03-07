  /** POST Methods */  

  /**
 * @swagger
 * tags:
 *   name: Users 
 *   description: Users master
 * /api/users/getUserList:
 *   post:
 *     summary: Display Users list
 *     tags: [Users]
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
 *         description: Return Users
 *         content:
 *           application/json:
 *             schema:
 *               type: object 
 *               properties:
 *                 sno:
 *                   type: integer
 *                 usid:
 *                    type: integer
 *                 username:
 *                     type: string
 *                 userdisplayname:
 *                      type: string
 *                 userpassword:
 *                   type: string
 *                 userroleid:
 *                    type: integer
 *                 status:
 *                     type: integer
 */

  /**
 * @swagger
 * tags:
 *   name: Users 
 *   description: Users master
 * /api/users/setUser:
 *   post:
 *     summary: Save Users
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -login_id
 *              -display_name
 *              -password
 *              -role_id
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                login_id:
*                    type: string
*                display_name:
*                     type: string
*                password:
*                  type: string
*                role_id:
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
 *   name: Users 
 *   description: Users master
 * /api/users/updateUser:
 *   post:
 *     summary: Update Users
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - userid
 *               - login_id
 *               - display_name
 *               - role_id
 *               - status_code
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               userid:
 *                 type: integer
 *               login_id:
 *                 type: string
 *               display_name:
 *                 type: string
 *               role_id:
 *                 type: integer
 *               status_code:
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
 *                 data:
 *                   type: object
 */
 

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users Details
 * /api/users/getUserDetails:
 *   post:
 *     summary: Display Users Details
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - userid
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               userid:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return Users details
 *         content:
 *           application/json:
 *             schema:
 *               type: object 
 *               properties:
 *                 status:
 *                   type: string
 *                 successcode:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 */

 /**
 * @swagger
 * tags:
 *   name: Users 
 *   description: Users master
 * /api/users/deleteUser:
 *   post:
 *     summary: Delete Users
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -userid
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               userid:
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
 *                   type: string             
 */

   /** POST Methods */
    /**
 * @swagger
 * tags:
 *   name: Users 
 *   description: Change Password
 * /api/users/setChangePassword:
 *   post:
 *     summary: Change password
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -old_password
 *              -new_password
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               old_password:
 *                 type: string
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
 *   name: Users 
 *   description: Reset Password
 * /api/users/resetPassword:
 *   post:
 *     summary: Reset password
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -userid
 *              -new_password
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               userid:
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
