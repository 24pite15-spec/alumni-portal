  /** POST Methods */  
/**
 * @swagger
 * tags:
 *   name: ERP SYNC 
 *   description: ERP SYNC
 * /api/sync/syncSupplier:
 *   post:
 *     summary: Sync Supplier to ERP
 *     tags: [ERP SYNC]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -supplierName
 *              -supplierType
 *              -supplierGroup
 *              -addressLine1
 *              -city
 *              -state
 *              -emailId
 *              -mobileNo
 *              -GSTIN
 *              -gstCategory
 *              -pan
 *             properties:
*                supplierName:
*                    type: string
*                supplierType:
*                    type: string
*                supplierGroup:
*                    type: string
*                addressLine1:
*                    type: string
*                city:
*                    type: string
*                state:
*                    type: string
*                emailId:
*                    type: string
*                mobileNo:
*                    type: string
*                GSTIN:
*                    type: string
*                gstCategory:
*                    type: string
*                pan:
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
 *   name: ERP SYNC 
 *   description: ERP SYNC
 * /api/sync/syncDebtor:
 *   post:
 *     summary: Sync Vendor to ERP
 *     tags: [ERP SYNC]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -vendor_name
 *              -contact_person
 *              -contact_no
 *              -address_line1
 *              -address_line2
 *              -city
 *              -state
 *              -country
 *              -pincode
 *              -email
 *              -gst
 *              -pan
 *              -bank_name
 *              -account_no
 *              -ifsc_code
 *             properties:
*                vendor_name:
*                    type: string
*                contact_person:
*                    type: string
*                contact_no:
*                    type: string
*                address_line1:
*                    type: string
*                address_line2:
*                    type: string
*                city:
*                    type: string
*                state:
*                    type: string
*                country:
*                    type: string
*                pincode:
*                    type: string
*                email:
*                    type: string
*                gst:
*                    type: string
*                pan:
*                    type: string
*                bank_name:
*                    type: string
*                account_no:
*                    type: string
*                ifsc_code:
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
 *   name: ERP SYNC 
 *   description: ERP SYNC
 * /api/sync/syncCreditor:
 *   post:
 *     summary: Sync Supplier to ERP
 *     tags: [ERP SYNC]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -supplier_name
 *              -contact_person
 *              -contact_no
 *              -address_line1
 *              -address_line2
 *              -city
 *              -state
 *              -country
 *              -pincode
 *              -email
 *              -gst
 *              -pan
 *              -bank_name
 *              -account_no
 *              -ifsc_code
 *             properties:
*                supplier_name:
*                    type: string
*                contact_person:
*                    type: string
*                contact_no:
*                    type: string
*                address_line1:
*                    type: string
*                address_line2:
*                    type: string
*                city:
*                    type: string
*                state:
*                    type: string
*                country:
*                    type: string
*                pincode:
*                    type: string
*                email:
*                    type: string
*                gst:
*                    type: string
*                pan:
*                    type: string
*                bank_name:
*                    type: string
*                account_no:
*                    type: string
*                ifsc_code:
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
 *   name: ERP SYNC 
 *   description: ERP SYNC
 * /api/sync/syncPayment:
 *   post:
 *     summary: Sync Payment From ERP
 *     tags: [ERP SYNC]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -filter_date
 *             properties:
*                filter_date:
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
 *   name: ERP SYNC 
 *   description: ERP SYNC
 * /api/sync/syncReceipt:
 *   post:
 *     summary: Sync Receipt From ERP
 *     tags: [ERP SYNC]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -filter_date
 *             properties:
*                filter_date:
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
 *   name: ERP SYNC 
 *   description: ERP SYNC
 * /api/sync/syncCreatePurchase:
 *   post:
 *     summary: Sync Purchase To ERP
 *     tags: [ERP SYNC]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -supplier_name
 *              -posting_date
 *              -bill_no
 *              -bill_date
 *              -items
 *              -taxes
 *              -remarks
 *             properties:
*                supplier_name:
*                    type: string
*                posting_date:
*                    type: string
*                bill_no:
*                    type: string
*                bill_date:
*                    type: string
*                items:
*                    type: array
*                taxes:
*                    type: array
*                remarks:
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
 *   name: ERP SYNC 
 *   description: ERP SYNC
 * /api/sync/syncPurchaseCancel:
 *   post:
 *     summary: Sync Purchase Cancel To ERP
 *     tags: [ERP SYNC]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -purchase_invoice_no
 *             properties:
*                purchase_invoice_no:
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
 *   name: ERP SYNC 
 *   description: ERP SYNC
 * /api/sync/syncCreateSales:
 *   post:
 *     summary: Sync Sales To ERP
 *     tags: [ERP SYNC]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -customer_name
 *              -posting_date
 *              -bill_no
 *              -bill_date
 *              -items
 *              -taxes
 *              -remarks
 *             properties:
*                customer_name:
*                    type: string
*                posting_date:
*                    type: string
*                bill_no:
*                    type: string
*                bill_date:
*                    type: string
*                items:
*                    type: array
*                taxes:
*                    type: array
*                remarks:
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
 *   name: ERP SYNC 
 *   description: ERP SYNC
 * /api/sync/syncSalesCancel:
 *   post:
 *     summary: Sync Sales Cancel To ERP
 *     tags: [ERP SYNC]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -sales_invoice_no
 *             properties:
*                sales_invoice_no:
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
 *   name: ERP SYNC 
 *   description: ERP SYNC
 * /api/sync/syncSalesReturn:
 *   post:
 *     summary: Sync Sales Return To ERP
 *     tags: [ERP SYNC]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              -customer_name
 *              -posting_date
 *              -items
 *              -taxes
 *              -remarks
 *             properties:
*                customer_name:
*                    type: string
*                posting_date:
*                    type: string
*                items:
*                    type: array
*                taxes:
*                    type: array
*                remarks:
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
