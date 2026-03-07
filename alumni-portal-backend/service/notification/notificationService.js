const errorlogService = require('../ErrorLogMgmtService');
const constants = require('../../constants');
const pool = require('../../database/connection');
const cron = require('node-cron');
const admin = require('firebase-admin');
const { addToQueue } = require('../../service/queue');
const serviceAccount = require('../../api/swapifynow-store-eec3a-firebase-adminsdk-fbsvc-ea26f1dac8.json'); // 🔐 Your key file

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}


module.exports.sendNotification = async (req) => {
    // const { token, title, body, data } = req.body;

    //   if (!token || !title || !body) {
    //     return res.status(400).json({ error: 'token, title, and body are required' });
    //   }

    const token = "eZHBDI1twk2UkzzNmu8zo8:APA91bGIscJGt1bGplt2RrLiYTKM42zDjRTA63oPq798wa3ymh5qGmEMhk3-AIQxNBJ2wiT4Vb5NU6GWKW-PKCZag1N5PvDJ--Wvnf-7q8a-p28o1pr24Dk"
    const title = "Hello from Firebase Admin";
    const body = "This is a secure push notification";
    const data = {};
    const message = {
        token: token,
        notification: {
            title: title,
            body: body,
        },
        data: data || {}, // Optional key-value pair data
        android: {
            priority: 'high',
        },
        apns: {
            payload: {
                aps: {
                    sound: 'default',
                },
            },
        },
    };

    try {
        const response = await admin.messaging().send(message);
        return { message: 'Notification sent successfully', response };
    } catch (error) {
        console.error('Error sending message:', error);
        return { error: 'Failed to send notification', details: error.message };
    }
};


/**  Schedule a task to run 1 minute */
cron.schedule('*/1 * * * *', async () => {
    await addToQueue(async () => await udfnGetCustomerRequest())
        .then(res => {
            // return res
        })
        .catch(err => {
            console.error("Error:", err);
        });
});

module.exports.udfnSendCustomerRequest = async () => {
    try {
        await addToQueue(async () => await udfnGetCustomerRequest())
        .then(res => {
            // return res
        })
        .catch(err => {
            console.error("Error:", err);
        });
    }
    catch (error) {
        await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Sync Billing", error, "syncBillDetails");
        return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error }
    }
}

async function udfnGetCustomerRequest() {
    try {
            const reqResult = await pool.query(` SELECT rca_reqid,
                rca.rca_exp_amount, 
                st.str_name, 
                dm.dm_name, 
                br.br_name,
                ARRAY_AGG(DISTINCT vft.vft_fcm_token) AS fcm_tokens
            FROM trn_request_customer_amount rca
            INNER JOIN trn_request req ON req.reqid = rca.rca_reqid
            INNER JOIN mr_store st ON req.req_maker = st.str_email
            INNER JOIN mr_verifier ver ON st.strid = ANY(ver.vr_strid) 
            INNER JOIN mr_verifier_fcm_token vft ON ver.vrid = vft.vft_verifier_id and vft_status_code = 1
            INNER JOIN mr_variant vt ON vt.vtid = req.req_vtid
            INNER JOIN mr_device_model dm ON dm.dmid = vt.vt_dmid
            INNER JOIN mr_device_brand br ON br.brid = dm.dm_brid
            WHERE rca.rca_notification_flag != 1 and req_stsid = 9
            GROUP BY rca.rca_exp_amount, st.str_name, dm.dm_name, br.br_name, rca_reqid`);

        if (reqResult && reqResult.rows.length > 0) {
            reqResult.rows.forEach(row => {
                sendMulticastNotification(row.rca_reqid,
                    row.fcm_tokens,  // assuming it's an array of tokens
                    "Customer Request",
                    `The customer has requested ₹${row.rca_exp_amount} for the ${row.br_name} ${row.dm_name} from the ${row.str_name}`,
                    {}
                );
            });
        }
        // return constants.COMMON.UPDATE_RESPONSE;
    } catch (error) {
        await errorlogService.errorlog(constants.ERROR_LOG_MESSAGE.PLAT_FORM_NAME, "Notification", error, "udfnGetCustomerRequest");
        return { "status": constants.COMMON.ERROR_CODE, "statuscode": constants.COMMON.ERROR_CODE, "message": error }
    }
}

const sendMulticastNotification = async (reqid, tokens, title, body, data = {}) => {
    const message = {
        notification: { title, body },
        data,
        tokens, // array of tokens (max 500)
        apns: {
            payload: {
                aps: {
                    alert: { title, body },
                    sound: 'default',
                    contentAvailable: true,
                },
            },
        },
        android: {
            priority: 'high',
        },
    };
    try {
        const response = await admin.messaging().sendEachForMulticast(message);
        // console.log(`response.responses`, response.responses);
         if (response?.successCount > 0) {
            await pool.query(`UPDATE trn_request_customer_amount SET rca_notification_flag = 1 WHERE rca_reqid = $1`, [reqid]);
         }
         else
         {
            await pool.query(`UPDATE trn_request_customer_amount SET rca_notification_flag = 2 WHERE rca_reqid = $1`, [reqid]);
         }
       
    } catch (error) {
        console.error('❌ Error sending multicast:', error.message);
    }
}