/**
 * @swagger
 * tags:
 *   name: Vendor Mapping
 *   description: Vendor Mapping master
 * /api/vendorMapping/setVendorMapping:
 *   post:
 *     summary: Save Vendor Mapping
 *     tags: [Vendor Mapping]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - vendor_id
 *               - store_id
 *               - fee_type
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               vendor_id:
 *                 type: integer
 *               store_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *               fee_type:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - fee_id
 *                     - amount
 *                   properties:
 *                     fee_id:
 *                       type: number
 *                     amount:
 *                       type: number
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
 *                   type: integer
 *                 data:
 *                   type: array
 */
/**
 * @swagger
 * tags:
 *   name: Vendor Mapping
 *   description: Vendor Mapping master
 * /api/vendorMapping/updateVendorMapping:
 *   post:
 *     summary: Update Vendor Mapping
 *     tags: [Vendor Mapping]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - vendor_mapping_id
 *               - vendor_id
 *               - store_id
 *               - fee_type
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               vendor_mapping_id:
 *                 type: integer
 *               vendor_id:
 *                 type: integer
 *               store_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *               fee_type:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - fee_id
 *                     - amount
 *                   properties:
 *                     fee_id:
 *                       type: number
 *                     amount:
 *                       type: number
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
 *                   type: integer
 *                 data:
 *                   type: array
 */
/**
 * @swagger
 * tags:
 *   name: Vendor Mapping 
 *   description: Vendor Mapping master
 * /api/vendorMapping/getVendorMappingDetails:
 *   post:
 *     summary: Vendor Mapping details
 *     tags: [Vendor Mapping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_name
 *               - vendor_mapping_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               vendor_mapping_id:
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

