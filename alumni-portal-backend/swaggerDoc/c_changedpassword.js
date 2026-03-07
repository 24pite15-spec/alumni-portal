
/** POST Methods */
/**
 * @swagger
 * tags:
 *   name: Change Password
 *   description: Change Password API
 * /api/changepassword/loginChangePassword:
 *   post:
 *     summary: Admin Change Password
 *     tags: [Change Password]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - old_password
 *               - new_password
 *               - is_partner
 *             properties:
 *               user_id:
 *                 type: number
 *                 description: The unique ID of the user whose password is being changed.
 *               user_name:
 *                 type: string
 *                 description: The name of the user whose password is being changed.
 *               old_password:
 *                 type: string
 *                 description: The current password of the user.
 *               new_password:
 *                 type: string
 *                 description: The new password that the user wants to set.
 *               is_partner:
 *                 type: number
 *                 description: The partner or admin.
 *     responses:
 *       200:
 *         description: Password change success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Response status code.
 *                 successcode:
 *                   type: integer
 *                   description: A specific code indicating the result of the password change.
 *                 message:
 *                   type: string
 *                   description: A message describing the result of the password change.
 */

/**
 * @swagger
 * tags:
 *   name: Change Password
 *   description: Change Password
 * /api/changepassword/vendorChangePassword:
 *   post:
 *     summary: Vendor Change Password
 *     tags: [Change Password]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - old_password
 *               - new_password
 *             properties:
 *               user_id:
 *                 type: number
 *                 description: The unique ID of the user whose password is being changed.
 *               user_name:
 *                 type: string
 *                 description: The name of the user whose password is being changed.
 *               old_password:
 *                 type: string
 *                 description: The current password of the user.
 *               new_password:
 *                 type: string
 *                 description: The new password that the user wants to set.
 *     responses:
 *       200:
 *         description: Password change success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Response status code.
 *                 successcode:
 *                   type: integer
 *                   description: A specific code indicating the result of the password change.
 *                 message:
 *                   type: string
 *                   description: A message describing the result of the password change.
 */


/**
 * @swagger
 * tags:
 *   name: Change Password
 *   description: Change Password
 * /api/changepassword/verifierChangePassword:
 *   post:
 *     summary: Verifier Change Password
 *     tags: [Change Password]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - old_password
 *               - new_password
 *             properties:
 *               user_id:
 *                 type: number
 *                 description: The unique ID of the user whose password is being changed.
 *               user_name:
 *                 type: string
 *                 description: The name of the user whose password is being changed.
 *               old_password:
 *                 type: string
 *                 description: The current password of the user.
 *               new_password:
 *                 type: string
 *                 description: The new password that the user wants to set.
 *     responses:
 *       200:
 *         description: Password change success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Response status code.
 *                 successcode:
 *                   type: integer
 *                   description: A specific code indicating the result of the password change.
 *                 message:
 *                   type: string
 *                   description: A message describing the result of the password change.
 */
