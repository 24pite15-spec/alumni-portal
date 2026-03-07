  /** POST Methods */  
/**
 * @swagger
 * tags:
 *   name: Vendor 
 *   description: Vendor master
 * /api/vendor/setVendor:
 *   post:
 *     summary: Save Vendor
 *     tags: [Vendor]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -vendor_name
 *              -contact_person
 *              -contact_no
 *              -email
 *              -address_line1
 *              -address_line2
 *              -city
 *              -state
 *              -country
 *              -pincode
 *              -gst
 *              -pan
 *              -bank_name
 *              -account_no
 *              -ifsc_code
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                vendor_name:
*                    type: string
*                contact_person:
*                   type: string
*                contact_no:
*                   type: string
*                email:
*                   type: string
*                address_line1:
*                   type: string
*                address_line2:
*                   type: string
*                city:
*                   type: string
*                state:
*                   type: string
*                country:
*                   type: string
*                pincode:
*                   type: string
*                gst:
*                   type: string
*                pan:
*                   type: string
*                bank_name:
*                   type: string
*                account_no:
*                   type: string
*                ifsc_code:
*                   type: string
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
 *   name: Vendor 
 *   description: Vendor master
 * /api/vendor/updateVendor:
 *   post:
 *     summary: Update Vendor
 *     tags: [Vendor]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -status_id
 *              -vendor_id
 *              -vendor_name
 *              -contact_person
 *              -contact_no
 *              -email
 *              -address_line1
 *              -address_line2
 *              -city
 *              -state
 *              -country
 *              -pincode
 *              -gst
 *              -pan
 *              -bank_name
 *              -account_no
 *              -ifsc_code
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                status_id:
*                    type: integer
*                vendor_id:
*                    type: integer
*                vendor_name:
*                    type: string
*                contact_person:
*                   type: string
*                contact_no:
*                   type: string
*                email:
*                   type: string
*                address_line1:
*                   type: string
*                address_line2:
*                   type: string
*                city:
*                   type: string
*                state:
*                   type: string
*                country:
*                   type: string
*                pincode:
*                   type: string
*                gst:
*                   type: string
*                pan:
*                   type: string
*                bank_name:
*                   type: string
*                account_no:
*                   type: string
*                ifsc_code:
*                   type: string
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
 *   name: Vendor 
 *   description: Vendor master
 * /api/vendor/deleteVendor:
 *   post:
 *     summary: DELETE Vendor
 *     tags: [Vendor]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -user_id
 *              -user_name
 *              -vendor_id
 *             properties:
*                user_id:
*                   type: integer
*                user_name:
*                    type: string
*                vendor_id:
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
 *   name: Vendor 
 *   description: Vendor master
 * /api/vendor/getVendorList:
 *   post:
 *     summary: Vendor list
 *     tags: [Vendor]
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
 *   name: Vendor 
 *   description: Vendor master
 * /api/vendor/getVendorDetails:
 *   post:
 *     summary: Vendor details
 *     tags: [Vendor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - vendor_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               vendor_id:
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



