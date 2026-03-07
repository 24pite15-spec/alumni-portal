  /** POST Methods */  

/**
 * @swagger
 * tags:
 *   name: Brand 
 *   description: Brand master
 * /api/brand/setBrand:
 *   post:
 *     summary: Save Brand
 *     tags: [Brand]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -category_id
 *              -brand_name
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                category_id:
*                   type: integer
*                brand_name:
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


/**
* @swagger
* tags:
*   name: Brand
*   description: Brand master
* /api/brand/updateBrand:
*   post:
*     summary: Update Brand
*     tags: [Brand]
*     requestBody:
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*              - user_id
*              - user_name
*              - category_id
*              - brand_id
*              - brand_name
*             properties:
*               user_id:
*                 type: integer
*               user_name:
*                 type: string
*               category_id:
*                 type: integer
*               brand_id:
*                 type: integer
*               brand_name:
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
 *   name: Brand 
 *   description: Brand master
 * /api/brand/deleteBrand:
 *   post:
 *     summary: delete Brand
 *     tags: [Brand]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -brand_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               brand_id:
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
 *   name: Brand 
 *   description: Brand master
 * /api/brand/getBrandList:
 *   post:
 *     summary: Brand list
 *     tags: [Brand]
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
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               order_flag:
 *                 type: integer
 *               source:
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
 *   name: Brand 
 *   description: Brand master
 * /api/brand/getBrandDetails:
 *   post:
 *     summary: Brand details
 *     tags: [Brand]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - brand_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               brand_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return Brand Details
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

