  /** POST Methods */  

/**
 * @swagger
 * tags:
 *   name: Company 
 *   description: Company master
 * /api/company/updateCompany:
 *   post:
 *     summary: Update Company
 *     tags: [Company]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -company_name
 *              -address
 *              -state_code
 *              -country
 *              -gst
 *              -contact_no
 *              -mobile_no
 *              -email
 *              -tax_id
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                company_name:
*                    type: string
*                address:
*                    type: string
*                state_code:
*                    type: integer
*                country:
*                    type: string
*                gst:
*                    type: string
*                contact_no:
*                    type: string
*                mobile_no:
*                    type: string
*                email:
*                    type: string
*                tax_id:
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
 *   name: Company 
 *   description: Company master
 * /api/company/getCompanyDetails:
 *   post:
 *     summary: Get Company Details
 *     tags: [Company]
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
