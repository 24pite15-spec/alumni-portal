  /** POST Methods */  

/**
 * @swagger
 * tags:
 *   name: Request 
 *   description: Request
 * /api/request/setRequest:
 *   post:
 *     summary: Save Request
 *     tags: [Request]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -variant_id
 *              -question_details
 *              -imei
 *              -request_id
 *              -expected_amount
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                variant_id:
*                   type: integer
*                question_details:
*                    type: array
*                imei:
*                    type: string
*                request_id:
*                    type: integer
*                expected_amount:
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
 *   name: Request 
 *   description: Request
 * /api/request/updateRequest:
 *   post:
 *     summary: Update Request
 *     tags: [Request]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -request_id
 *              -status_id
 *              -source
 *              -variant_id
 *              -device_details
 *              -imei
 *              -remarks
 *              -device_images
 *              -storeperson_image
 *              -customer_name
 *              -mobile_no
 *              -email_id 
 *              -max_amount
 *              -customer_documents
 *              -new_variant_id
 *              -new_imei
 *              -instructions
 *              -customer_certify
 *              -from_verification
 *              -verification_code
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                request_id:
*                   type: integer
*                status_id:
*                   type: integer
*                source:
*                   type: integer
*                variant_id:
*                   type: integer
*                device_details:
*                    type: array
*                imei:
*                    type: string
*                remarks:
*                    type: string
*                device_images:
*                    type: array
*                storeperson_image:
*                    type: array
*                customer_name:
*                    type: string
*                mobile_no:
*                    type: string
*                email_id:
*                    type: string 
*                max_amount:
*                    type: string
*                customer_documents:
*                    type: array
*                new_variant_id:
*                    type: integer
*                new_imei:
*                    type: string
*                instructions:
*                    type: array
*                customer_certify:
*                    type: integer
*                from_verification:
*                    type: integer
*                verification_code:
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
 *   name: Request 
 *   description: Request
 * /api/request/deleteRequest:
 *   post:
 *     summary: Delete Request
 *     tags: [Request]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -request_id
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                request_id:
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
 *   name: Request 
 *   description: Request
 * /api/request/getRequestList:
 *   post:
 *     summary: List Request
 *     tags: [Request]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -from_date
 *              -to_date
 *              -category_id
 *              -brand_id
 *              -model_id
 *              -imei
 *              -order_id
 *              -mobile_no
 *              -status_id
 *              -source
 *              -partner_id
 *              -store_id
 *              -limit
 *              -offset
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                from_date:
*                   type: string
*                to_date:
*                    type: string
*                category_id:
*                    type: integer
*                brand_id:
*                    type: integer
*                model_id:
*                    type: integer
*                imei:
*                    type: string
*                order_id:
*                    type: string
*                mobile_no:
*                    type: string
*                status_id:
*                    type: integer
*                source:
*                    type: integer
*                partner_id:
*                    type: integer
*                store_id:
*                    type: integer
*                limit:
*                    type: integer
*                offset:
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
 *   name: Request 
 *   description: Request
 * /api/request/getRequestDetails:
 *   post:
 *     summary: Request Details
 *     tags: [Request]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -request_id
 *              -source
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                request_id:
*                    type: integer
*                source:
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
 *   name: Request 
 *   description: Request
 * /api/request/revertRequestStatus:
 *   post:
 *     summary: Revert Request Status
 *     tags: [Request]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -request_id
 *              -status_id
 *              -reason
 *              -source
 *              -remarks
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                request_id:
*                    type: integer
*                status_id:
*                    type: integer
*                reason:
*                    type: string
*                source:
*                    type: integer
*                remarks:
*                    type: string
 *     responses:
 *       200:
 *         description: Return Update statement
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
 *   name: Request 
 *   description: Request
 * /api/request/getRequestListExcel:
 *   post:
 *     summary: List Request Excel
 *     tags: [Request]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -from_date
 *              -to_date
 *              -category_id
 *              -brand_id
 *              -model_id
 *              -imei
 *              -order_id
 *              -mobile_no
 *              -status_id
 *              -source
 *              -partner_id
 *              -store_id
 *              -is_partner
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                from_date:
*                   type: string
*                to_date:
*                    type: string
*                category_id:
*                    type: integer
*                brand_id:
*                    type: integer
*                model_id:
*                    type: integer
*                imei:
*                    type: string
*                order_id:
*                    type: string
*                mobile_no:
*                    type: string
*                status_id:
*                    type: integer
*                source:
*                    type: integer
*                partner_id:
*                    type: integer
*                store_id:
*                    type: integer
*                is_partner:
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
 *   name: Request 
 *   description: Request
 * /api/request/setRequestVerificationCode:
 *   post:
 *     summary: Verification code
 *     tags: [Request]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -source
 *              -email_id
 *              -mobile_no
 *              -request_id
 *              -customer_name
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                source:
*                    type: integer
*                email_id:
*                    type: string
*                mobile_no:
*                    type: string
*                request_id:
*                    type: integer
*                customer_name:
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
 *   name: Request 
 *   description: Check IMEI number
 * /api/request/checkImeiNo:
 *   post:
 *     summary: IMEI number
 *     tags: [Request]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -source
 *              -imei
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                source:
*                    type: integer
*                imei:
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
 *   name: Request 
 *   description: Request
 * /api/request/getRequestCustomerDetails:
 *   post:
 *     summary: Request Customer Details
 *     tags: [Request]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -customer_mobileno 
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                customer_mobileno:
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
 *   name: Request 
 *   description: update customer amount
 * /api/request/updateCustomerAmount:
 *   post:
 *     summary: Update Customer Amount
 *     tags: [Request]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -request_id 
 *              -exp_amount 
 *              -verifier_amount 
 *              -source 
 *              -status_code 
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                request_id:
*                    type: integer 
*                exp_amount:
*                    type: string 
*                verifier_amount:
*                    type: string 
*                source:
*                    type: integer 
*                status_code:
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
 *   name: Request 
 *   description: update customer amount
 * /api/request/sendNotification:
 *   post:
 *     summary: Update Customer Amount
 *     tags: [Request]
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