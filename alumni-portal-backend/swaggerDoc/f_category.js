  /** POST Methods */  

/**
 * @swagger
 * tags:
 *   name: Category 
 *   description: Category master
 * /api/category/setCategory:
 *   post:
 *     summary: Save Category
 *     tags: [Category]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -category_name
 *              -tax_id
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                category_name:
*                    type: string
*                tax_id:
*                 type: number
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
*   name: Category
*   description: Category master
* /api/category/updateCategory:
*   post:
*     summary: Update Category
*     tags: [Category]
*     requestBody:
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*              - user_id
*              - user_name
*              - category_id
*              - category_name
*              - tax_id
*             properties:
*               user_id:
*                 type: integer
*               user_name:
*                 type: string
*               category_id:
*                 type: integer
*               category_name:
*                 type: string
*               tax_id:
*                 type: number
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
 *   name: Category 
 *   description: Category master
 * /api/category/deleteCategory:
 *   post:
 *     summary: delete Category
 *     tags: [Category]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -category_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               category_id:
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
 *   name: Category 
 *   description: Category master
 * /api/category/getCategoryList:
 *   post:
 *     summary: Category list
 *     tags: [Category]
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
 *               - is_partner
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               order_flag:
 *                 type: integer
 *               source:
 *                 type: integer
 *               is_partner:
 *                 type: integer 
 *     responses:
 *       200:
 *         description: Return Category List
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
 *   name: Category 
 *   description: Category master
 * /api/category/getCategoryDetails:
 *   post:
 *     summary: Category details
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - category_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               category_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return Category Details
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

