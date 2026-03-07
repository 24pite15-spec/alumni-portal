/** POST Methods */

/**
 * @swagger
 * tags:
 *   - name:  Error Details
 *     description: Error Details
 * /api/error/errorLogInfo:
 *   post:
 *     summary: Error Details
 *     tags: 
 *       - Error Details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object 
 *             required:
 *               - user_id
 *               - user_name
 *               - platform
 *               - Module
 *               - error
 *               - functionality
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               platform:
 *                 type: string
 *               Module:
 *                 type: string
 *               error:
 *                 type: string
 *               functionality:
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
 */
