/** POST Methods */  

/**
 * @swagger
 * tags:
 *   - name:  Master Details
 *     description: Status Details
 * /api/masterdata/getStatusDetails:
 *   post:
 *     summary: Status list
 *     tags: 
 *       - Master Details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object 
 *             required:
 *               - user_id
 *               - user_name
 *               - source
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               source:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return success statement
 *         content:
 *           application/json:
 *             schema:
 *               type: object 
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 user_name:
 *                   type: string
 */


/**
 * @swagger
 * tags:
 *   - name:  Master Details
 *     description: State Details
 * /api/masterdata/getStateDetails:
 *   post:
 *     summary: State list
 *     tags: 
 *       - Master Details
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
 *         description: Return success statement
 *         content:
 *           application/json:
 *             schema:
 *               type: object 
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 user_name:
 *                   type: string
 */

/**
 * @swagger
 * tags:
 *   - name:  Master Details
 *     description: Reject Reason List
 * /api/masterdata/getRejectReasonList:
 *   post:
 *     summary: Reject Reason List
 *     tags: 
 *       - Master Details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object 
 *             required:
 *               - user_id
 *               - user_name
 *               - source
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               source:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return success statement
 *         content:
 *           application/json:
 *             schema:
 *               type: object 
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 user_name:
 *                   type: string
 */


/**
 * @swagger
 * tags:
 *   - name:  Master Details
 *     description: Tax Details
 * /api/masterdata/getTaxList:
 *   post:
 *     summary: Tax list
 *     tags: 
 *       - Master Details
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
 *         description: Return success statement
 *         content:
 *           application/json:
 *             schema:
 *               type: object 
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 user_name:
 *                   type: string
 */


/**
 * @swagger
 * tags:
 *   - name:  Master Details
 *     description: Status Details
 * /api/masterdata/getTransactionStatusDetails:
 *   post:
 *     summary: Status list
 *     tags: 
 *       - Master Details
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
 *         description: Return success statement
 *         content:
 *           application/json:
 *             schema:
 *               type: object 
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 user_name:
 *                   type: string
 */