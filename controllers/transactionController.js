const Transaction = require("../models/transaction.model");
const connectToDB = require("../lib/mongoose");
const crypto = require("crypto");
const https = require("https");

const partnerCode = "MOMO";
const accessKey = "F8BBA842ECF85";
const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const requestType = "captureWallet";

const userInfo = {
    "id": "testId123",
    "name": "Nguyen Van A Tst",
    "phoneNumber": "0999888999",
    "email": "email_add@domain.com",
}

class TransactionController {
    async createTransaction(req, res) {
        const { amount, orderInfo } = req.body;
        try {
            const requestId = partnerCode + new Date().getTime();
            const orderId = requestId;
            const redirectUrl = "http://localhost:3000/transactions";
            const ipnUrl = "http://localhost:3000/";
            const extraData = "";

            const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

            const signature = crypto
                .createHmac("sha256", secretkey)
                .update(rawSignature)
                .digest("hex");
            console.log("--------------------SIGNATURE----------------");
            console.log(signature);

            const requestBody = JSON.stringify({
                partnerCode: partnerCode,
                accessKey: accessKey,
                requestId: requestId,
                amount: amount,
                orderId: orderId,
                orderInfo: orderInfo,
                redirectUrl: redirectUrl,
                ipnUrl: ipnUrl,
                extraData: extraData,
                requestType: requestType,
                signature: signature,
                lang: "en",
                userInfo: userInfo,
                // items: items,
            });

            // Create the HTTPS request
            const options = {
                hostname: "test-payment.momo.vn",
                port: 443,
                path: "/v2/gateway/api/create",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(requestBody),
                },
            };

            const req = https.request(options, (momoRes) => {
                momoRes.setEncoding("utf8");

                let resBody = "";

                momoRes.on("data", async (body) => {
                    resBody += body;
                    console.log("Body:");
                    console.log(body);

                    const resBodyObj = JSON.parse(body);

                    const transaction = new Transaction({
                        orderId,
                        amount,
                        userInfo,
                        // items,
                        status: resBodyObj.message === "Successful." ? "Transaction Created." : resBodyObj.message,
                        transactionInfo: resBody,
                    });
                    // Save transaction vào db
                    try {
                        const payUrl = JSON.parse(body).payUrl;
                        res.json({
                            message: "Transaction created successfully",
                            payUrl,
                        });
                    } catch (error) {
                        console.error("Error save transac:", error);
                        res.status(500).json({
                            message: "Internal server",
                            error: error.message,
                        });
                    }

                    connectToDB();
                    await transaction.save();
                });
            });

            req.on("error", (e) => {
                console.log(`Problem with request: ${e.message}`);
                res.status(500).json({
                    message: "Internal server error",
                    error: e.message,
                });
            });

            // Write data to request body and send the request
            console.log("Sending Momo payment request...");
            req.write(requestBody);
            req.end();
        } catch (error) {
            console.error("Error creating transaction:", error);
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    async checkTransactionStatusByOrderId(req, res) {
        const { id } = req.params;

        try {
            const orderId = id;
            const requestId = partnerCode + new Date().getTime();

            //Signature
            const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`;

            const signature = crypto
                .createHmac("sha256", secretkey)
                .update(rawSignature)
                .digest("hex");
            console.log("--------------------SIGNATURE----------------");
            console.log(signature);

            const requestBody = JSON.stringify({
                partnerCode: partnerCode,
                requestId: requestId,
                orderId: orderId,
                lang: "en",
                signature: signature,
            });

            // Create the HTTPS request
            const options = {
                hostname: "test-payment.momo.vn",
                port: 443,
                path: "/v2/gateway/api/query",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(requestBody),
                },
            };

            //Xu ly Response
            const checkStatusReq = https.request(options, (momoRes) => {
                momoRes.setEncoding("utf8");

                momoRes.on("data", async (body) => {
                    const resBodyObj = JSON.parse(body);
                    res.json(resBodyObj);
                    const orderIdFromMomo = resBodyObj.orderId;

                    //Update status và transId trong DB
                    connectToDB();
                    const transaction = await Transaction.findOne({ orderId: orderIdFromMomo });
                    transaction.transId = resBodyObj.transId;
                    transaction.status = resBodyObj.message;
                    await transaction.save();
                });

            });

            checkStatusReq.on("error", (e) => {
                console.log(`Problem with request: ${e.message}`);
                res.status(500).json({
                    message: "Internal server error",
                    error: e.message,
                });
            });

            // Write data to request body and send the request
            checkStatusReq.write(requestBody);
            checkStatusReq.end();
        } catch (error) {
            console.error("Error creating transaction:", error);
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    async showAllTransactions(req, res) {
        connectToDB();
        try {
            const transactions = await Transaction.find();
            res.json({ transactions });
        } catch (error) {
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    async refundTransaction(req, res) {
        const { amount, transId, description } = req.body;
        const TID = transId;
        try {
            const orderId = partnerCode + new Date().getTime();;
            const requestId = partnerCode + new Date().getTime();
            //Signature
            const rawSignature = `accessKey=${accessKey}&amount=${amount}&description=${description}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}&transId=${transId}`

            const signature = crypto
                .createHmac("sha256", secretkey)
                .update(rawSignature)
                .digest("hex");
            console.log("--------------------SIGNATURE----------------");
            console.log(signature);

            const requestBody = JSON.stringify({
                partnerCode: partnerCode,
                requestId: requestId,
                orderId,
                amount: amount,
                transId: transId,
                lang: "en",
                description: description,
                signature: signature,
            });

            // Create the HTTPS request
            const options = {
                hostname: "test-payment.momo.vn",
                port: 443,
                path: "/v2/gateway/api/refund",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(requestBody),
                },
            };

            //Xu ly Response
            const checkStatusReq = https.request(options, (momoRes) => {
                // console.log(`Status: ${momoRes.statusCode}`);
                // console.log(`Headers: ${JSON.stringify(momoRes.headers)}`);
                momoRes.setEncoding("utf8");

                momoRes.on("data", async (body) => {
                    console.log("Body:");
                    console.log(body);
                    const resBodyObj = JSON.parse(body);
                    console.log(resBodyObj);
                    res.json(resBodyObj);
                    //Refund thành công thì cập nhật lại transaction trong DB
                    if (resBodyObj.resultCode === 0) {
                        connectToDB();
                        const transaction = await Transaction.findOne({ transId: TID })
                        transaction.status = "Refunded."
                        transaction.refundInfo = resBodyObj
                        transaction.save();
                    }
                });
            });

            checkStatusReq.on("error", (e) => {
                console.log(`Problem with request: ${e.message}`);
                res.status(500).json({
                    message: "Internal server error",
                    error: e.message,
                });
            });

            // Write data to request body and send the request
            checkStatusReq.write(requestBody);
            checkStatusReq.end();
        } catch (error) {
            console.error("Error refund:", error);
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }

}


module.exports = new TransactionController();
