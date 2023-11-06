const express = require("express");
const router = express.Router();

const transactionController = require('../controllers/transactionController')


router.get("/create-transaction", async (req, res) => {
    res.render("createTransaction");
});

router.post("/create-transaction", transactionController.createTransaction);

router.post("/checkStatus/:id", transactionController.checkTransactionStatusByOrderId); 

router.post("/refund", transactionController.refundTransaction); // request body gom transId, amount, description

router.get("/", transactionController.showAllTransactions);

//
//
//
//
//
// router.post("/process-transaction", async (req, res) => {
//     const { amount, orderInfo } = req.body;
    
//     try {
//         const requestId = partnerCode + new Date().getTime();
//         const orderId = requestId;
//         const redirectUrl = "http://localhost:3000/transactions";
//         const ipnUrl = "http://localhost:3000/";
//         const extraData = "";

        
//         const createTransactionData = {
//             partnerCode: partnerCode,
//             accessKey: accessKey,
//             requestId: requestId,
//             amount: amount,
//             orderId: orderId,
//             orderInfo: orderInfo,
//             redirectUrl: redirectUrl,
//             ipnUrl: ipnUrl,
//             extraData: extraData,
//             requestType: requestType,
//             lang: "en",
//             userInfo: userInfo,
//         };

//         // Tạo chữ ký cho việc tạo giao dịch
//         const rawSignatureForCreate = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

//         const signatureForCreate = crypto
//             .createHmac("sha256", secretkey)
//             .update(rawSignatureForCreate)
//             .digest("hex");
//         console.log("--------------------SIGNATURE----------------");
//         console.log(signatureForCreate);

//         // Thêm chữ ký vào dữ liệu JSON
//         createTransactionData.signature = signatureForCreate;

//         // Chuyển dữ liệu JSON thành chuỗi JSON
//         const createTransactionRequestBody = JSON.stringify(createTransactionData);

//         // Tạo yêu cầu HTTPS cho việc tạo giao dịch
//         const createTransactionOptions = {
//             hostname: "test-payment.momo.vn",
//             port: 443,
//             path: "/v2/gateway/api/create",
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Content-Length": Buffer.byteLength(createTransactionRequestBody),
//             },
//         };

//         const createTransactionReq = https.request(createTransactionOptions, (createTransactionRes) => {
//             console.log(`Status: ${createTransactionRes.statusCode}`);
//             createTransactionRes.setEncoding("utf8");

//             let createTransactionResBody = "";

//             createTransactionRes.on("data", async (body) => {
//                 createTransactionResBody += body;
//                 console.log("Create Transaction Response Body:");
//                 console.log(body);

//                 const createTransactionResBodyObj = JSON.parse(body);

//                 if (createTransactionResBodyObj.resultCode === 0) {
//                     // Giao dịch được tạo thành công, bạn có thể lưu thông tin giao dịch vào cơ sở dữ liệu
//                     const transaction = new Transaction({
//                         orderId,
//                         amount,
//                         userInfo,
//                         status: createTransactionResBodyObj.message,
//                         transactionInfo: createTransactionResBody,
//                     });

//                     try {
//                         await transaction.save();
//                     } catch (error) {
//                         console.error("Error saving transaction:", error);
//                     }

//                     // Kiểm tra trạng thái giao dịch sau khi tạo
//                     checkTransactionStatus(orderId, (status) => {
//                         if (status === "Transaction denied by user.") {
//                             // Giao dịch bị hủy bỏ, cập nhật trạng thái và xử lý logic tương ứng
//                             transaction.status = status;
//                             transaction.save();
//                         }

//                         const payUrl = createTransactionResBodyObj.payUrl;
//                         res.json({
//                             message: "Transaction created successfully",
//                             payUrl,
//                         });
//                     });
//                 } else {
//                     // Giao dịch không thành công, xử lý theo logic của bạn
//                     res.status(500).json({
//                         message: "Failed to create transaction",
//                         error: createTransactionResBodyObj.message,
//                     });
//                 }
//             });
//         });

//         createTransactionReq.on("error", (e) => {
//             console.log(`Problem with request: ${e.message}`);
//             res.status(500).json({
//                 message: "Internal server error",
//                 error: e.message,
//             });
//         });

//         createTransactionReq.write(createTransactionRequestBody);
//         createTransactionReq.end();
//     } catch (error) {
//         console.error("Error creating transaction:", error);
//         res.status(500).json({
//             message: "Internal server error",
//             error: error.message,
//         });
//     }
// });


module.exports = router;
