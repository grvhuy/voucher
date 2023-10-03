const { Schema, model, models } = require('mongoose');

const voucherSchema = new Schema({
    name: { type: String },
    startDate: { type: Date },
    expiredDate: { type: Date, required: true },
    description: { type: String },
    quantity: { type: Number },
    paymentType: [
        {
            type: String,
        },
    ],
    voucherType: { type: String }, //voucher shipUnit, của shop, voucher cho loại product 
    minimumOrderValue: { type: Number },
});

module.exports = models.Voucher || model('Voucher', voucherSchema);