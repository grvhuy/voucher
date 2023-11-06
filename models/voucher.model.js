const { mongoose, Schema, model, models } = require('mongoose');

const voucherSchema = new Schema({
    name: { type: String },
    startDate: { type: Date },
    expiredDate: { type: Date, required: true },
    description: { type: String },
    quantity: { type: Number },
    paymentType: {type: String},
    minimumOrderValue: { type: Number },
    voucherScope: {
        type: String,
        enum: ['shop', 'product', 'allOrders'], 
    },
    voucherScopeId: { type: String }, //type: mongoose.Schema.Types.ObjectId
});

module.exports = models.Voucher || model('Voucher', voucherSchema);