

/** POST Methods */
/**
* @swagger
* tags:
*   name: Login 
*   description: Login Process Managing API
* /api/login/login:
*   post:
*     summary: Login
*     tags: [Login]
*     requestBody:
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               user_id:
*                 type: string
*                 required: true
*               password:
*                 type: string
*                 required: true
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


/**
* @swagger
* tags:
*   name: Login 
*   description: VendorLogin Process Managing API
* /api/login/vendorLogin:
*   post:
*     summary: VendorLogin
*     tags: [Login]
*     requestBody:
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               user_id:
*                 type: string
*                 required: true 
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


/**
* @swagger
* tags:
*   name: Login 
*   description: VendorLogin Process Managing API
* /api/login/verifierLogin:
*   post:
*     summary: VerifierLogin
*     tags: [Login]
*     requestBody:
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               user_id:
*                 type: string
*                 required: true
*               password:
*                 type: string
*                 required: true
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

/**
* @swagger
* tags:
*   name: Login 
*   description: VendorLogin Process Managing API
* /api/login/setVendorVerificationCode:
*   post:
*     summary: Vendor verification code
*     tags: [Login]
*     requestBody:
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email_id:
*                 type: string
*                 required: true
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

/**
* @swagger
* tags:
*   name: Login 
*   description: VendorLogin Process Managing API
* /api/login/getVendorVerification:
*   post:
*     summary: Vendor verification
*     tags: [Login]
*     requestBody:
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email_id:
*                 type: string
*                 required: true
*               verification_code:
*                 type: string
*                 required: true
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

