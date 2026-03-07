  /** POST Methods */  

/**
 * @swagger
 * tags:
 *   name: User Role 
 *   description: User role master
 * /api/userrole/getMenuList:
 *   post:
 *     summary: Display menu list
 *     tags: [User Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Return User Role
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
 *   name: User Role 
 *   description: User role master
 * /api/userrole/setUserRole:
 *   post:
 *     summary: save user role
 *     tags: [User Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - role_name
 *               - menu_access
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               role_name:
 *                 type: string
 *               menu_access:
 *                 type: array
 *     responses:
 *       200:
 *         description: Return User Role
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
 *   name: User Role 
 *   description: User role master
 * /api/userrole/updateUserRole:
 *   post:
 *     summary: update user role
 *     tags: [User Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - role_name
 *               - menu_access
 *               - role_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               role_name:
 *                 type: string
 *               menu_access:
 *                 type: array
 *               role_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return User Role
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
 *   name: User Role 
 *   description: User role master
 * /api/userrole/deleteUserRole:
 *   post:
 *     summary: delete user role
 *     tags: [User Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - role_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               role_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return User Role
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
 *   name: User Role 
 *   description: User role master
 * /api/userrole/getUserRoleList:
 *   post:
 *     summary: user role list
 *     tags: [User Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Return User Role
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
 *   name: User Role 
 *   description: User role master
 * /api/userrole/getUserRoleDetails:
 *   post:
 *     summary: user role details
 *     tags: [User Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - role_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               role_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return User Role
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
