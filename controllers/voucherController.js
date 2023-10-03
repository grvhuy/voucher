const Voucher = require('../models/voucher.model')
const connectToDB = require('../lib/mongoose')

class VoucherController {
  async showVouchers(req, res) {
    try {
      connectToDB();
      const vouchers = await Voucher.find({})
      res.send(vouchers);
    } catch (error) {
      console.error('Error show vouchers:', error);
    }
  }

  async createVoucher(req, res) {
    try {
      connectToDB();
      const newVoucher = new Voucher(req.body); 
      await newVoucher.save();
      console.log('created voucher')
    } catch (error) {
      console.error('Error create voucher:', error);
    }
  }

  async getVoucher(req, res) {
    const idVouch = req.params.id;
    const voucher = await Voucher.findById(idVouch);
    res.send(voucher)
  }
  async deleteVoucher(req, res) {
    const {id} = req.params;
    Voucher.deleteOne({ _id: id })
    res.send("Voucher deleted")
  }
  async updateVoucher(req, res) {
    const {id} = req.params;
    Voucher.findByIdAndUpdate(id, req.body, { new: true })
    res.send("Voucher updated")
  }
}

module.exports = new VoucherController()