  /** POST Methods */  

/**
 * @swagger
 * tags:
 *   name: Question Setup 
 *   description:  Question Setup Save
 * /api/questionSetup/setQuestionSetup:
 *   post:
 *     summary: Save Question Setup
 *     tags: [Question Setup]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -category_id
 *              -question
 *              -description  
 *              -applicable
 *              -answers
 *              -question_brand
 *              -parent_qid
 *              -parent_option_id
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                category_id:
*                    type: integer
*                question:
*                    type: string
*                description:
*                    type: string
*                applicable:
*                    type: integer
*                parent_qid:
*                    type: integer
*                parent_option_id:
*                    type: integer
*                answers:
*                    type: array
*                question_brands:
*                    type: array
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
*   name: Question Setup
*   description: Question Setup Update
* /api/questionSetup/updateQuestionSetup:
*   post:
*     summary: Update Question Setup
*     tags: [Question Setup]
*     requestBody:
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*              -user_id
 *              -user_name
 *              -question_id
 *              -category_id
 *              -question
 *              -description
 *              -status_code
 *              -applicable
 *              -answers
 *              -question_brand
 *              -parent_qid
 *              -parent_option_id
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                question_id:
*                    type: integer
*                category_id:
*                    type: integer
*                question:
*                    type: string
*                description:
*                    type: string
*                status_code:
*                    type: integer
*                applicable:
*                    type: integer
*                parent_qid:
*                    type: integer
*                parent_option_id:
*                    type: integer
*                answers:
*                    type: array
*                question_brands:
*                    type: array
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
*   name: Question Setup
*   description: Question Setup Delete
* /api/questionSetup/deleteQuestionSetup:
*   post:
*     summary: Delete Question Setup
*     tags: [Question Setup]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -question_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               question_id:
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
*   name: Question Setup
*   description: Question Setup List
* /api/questionSetup/getQuestionSetupList:
*   post:
*     summary: Question Setup List
*     tags: [Question Setup]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - question
 *               - category_id
 *               - question_category_id
 *               - status_code
 *               - brand_id
 *               - source
 *               - isqueuelist
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               question:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               question_category_id:
 *                 type: integer
 *               status_code:
 *                 type: integer
 *               brand_id:
 *                 type: integer
 *               source:
 *                 type: integer
 *               isqueuelist:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return Question Setup List
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
*   name: Question Setup
*   description: Question Setup Details
* /api/questionSetup/getQuestionSetupDetails:
*   post:
*     summary: Question Setup Details
*     tags: [Question Setup]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - question_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               question_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return Question Setup Details
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
*   name: Question Setup
*   description: Question Order ID
* /api/questionSetup/setQuestionOrder:
*   post:
*     summary: Question Order ID
*     tags: [Question Setup]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - question_details
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               question_details:
 *                 type: array
 *     responses:
 *       200:
 *         description: Return Question Setup Details
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
