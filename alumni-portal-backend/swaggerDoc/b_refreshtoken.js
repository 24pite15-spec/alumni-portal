/** Get Methods */  


  /** POST Methods */
    /**
 * @swagger
 * tags:
 *   name: Refresh Token 
 *   description: Refresh Token API
 * /api/login/refreshToken:
 *   post:
 *     summary: Refresh Token 
 *     tags: [Refresh Token ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Return user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object 
 *               properties:
 *                 status:
 *                   type: integer
 *                 data:
 *                   type:array
 *                
 */
