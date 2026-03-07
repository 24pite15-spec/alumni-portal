  /** POST Methods */  

/**
 * @swagger
 * tags:
 *   name: Model 
 *   description: Model master
 * /api/model/setModel:
 *   post:
 *     summary: Save Model
 *     tags: [Model]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -model_name
 *              -brand_id
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                model_name:
*                    type: string
*                brand_id:
*                   type: integer
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
*   name: Model
*   description: Model master
* /api/model/updateModel:
*   post:
*     summary: Update Model
*     tags: [Model]
*     requestBody:
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*              - user_id
*              - user_name
*              - model_id
*              - model_name
*              - brand_id
*              - statuscode
*             properties:
*               user_id:
*                 type: integer
*               user_name:
*                 type: string
*               model_id:
*                 type: integer
*               model_name:
*                 type: string
*               brand_id:
*                 type: integer
*               statuscode:
*                 type: integer
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

 /**
 * @swagger
 * tags:
 *   name: Model 
 *   description: Model master
 * /api/model/deleteModel:
 *   post:
 *     summary: delete Model
 *     tags: [Model]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -model_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               model_id:
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
 */

/**
 * @swagger
 * tags:
 *   name: Model 
 *   description: Model master
 * /api/model/getModelList:
 *   post:
 *     summary: Model list
 *     tags: [Model]
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
 *         description: Return Model List
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
 *   name: Model 
 *   description: Model master
 * /api/model/getModelDetails:
 *   post:
 *     summary: Model details
 *     tags: [Model]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - model_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               model_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return Model Details
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

