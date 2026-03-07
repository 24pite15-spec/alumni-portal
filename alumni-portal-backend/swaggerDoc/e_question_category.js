  /** POST Methods */  

/**
 * @swagger
 * tags:
 *   name: Question Category 
 *   description: Question Category  master
 * /api/questioncategory/setQuestionCategory:
 *   post:
 *     summary: Save Question Category 
 *     tags: [Question Category]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -ques_category_name
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                ques_category_name:
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
*   name: Question Category
*   description: Question Category master
* /api/questioncategory/updateQuestionCategory:
*   post:
*     summary: Update Question Category
*     tags: [Question Category]
*     requestBody:
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*              - user_id
*              - user_name
*              - category_id
*              - status_id
*              - ques_category_name
*             properties:
*               user_id:
*                 type: integer
*               user_name:
*                 type: string
*               category_id:
*                 type: integer
*               status_id:
*                 type: integer
*               ques_category_name:
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
 *   name: Question Category 
 *   description: Question Category master
 * /api/questioncategory/deleteQuestionCategory:
 *   post:
 *     summary: Delete Question Category
 *     tags: [Question Category]
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
 *   name: Question Category 
 *   description: Question Category master
 * /api/questioncategory/getQuestionCategoryList:
 *   post:
 *     summary: Question Category list
 *     tags: [Question Category]
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
 *         description: Return Question Category List
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
 *   name: Question Category 
 *   description: Question Category master
 * /api/questioncategory/getQuestionCategoryDetails:
 *   post:
 *     summary: Question Category details
 *     tags: [Question Category]
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
 *         description: Return Question Category Details
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

