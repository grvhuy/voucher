const { Schema, model, models } = require('mongoose');

const transactionSchema = new Schema({
  orderId: {type: String},
  transId: {type: Number}, //TID do momo tạo ra
  userInfo: {type: Object},
  items: {type: Object},
  amount: {type: Number},
  status: {type: String, default: "pending"},
  createdAt: {type: Date, default: Date.now()},
  transactionInfo: {type: Object},
  refundInfo: {type: Object},
});

module.exports = models.Transaction || model('transaction', transactionSchema);