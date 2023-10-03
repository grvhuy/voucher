const Voucher = require("../models/voucher.model");
const connectToDB = require("../lib/mongoose");

class VoucherController {
    showVouchers(req, res) {
        connectToDB();
        Voucher.find({})
            .then((vouchers) => {
                res.send(vouchers);
            })
            .catch((error) => {
                console.error("Error show vouchers:", error);
            });
    }

    createVoucher(req, res) {
        connectToDB();
        console.log(req.body);
        const newVoucher = new Voucher(req.body);
        newVoucher
            .save()
            .then(() => {
                console.log("created voucher");
                res.send("Voucher created");
            })
            .catch((error) => {
                console.error("Error create voucher:", error);
            });
    }

    getVoucher = (req, res) => {
      connectToDB();
        const id = req.params.id;

        Voucher.findById(id)
            .then((voucher) => {
                if (!voucher) {
                    res.status(404).send({ error: "Voucher not found" });
                } else {
                    res.send(voucher);
                }
            })
            .catch((error) => {
                res.status(500).send({ error: error.message });
            });
    };

    deleteVoucher(req, res) {
      connectToDB();
        Voucher.deleteOne({ _id: req.params.id })
            .then(() => {
                res.send("Voucher deleted");
            })
            .catch((error) => {
                console.error("Error deleting voucher:", error);
            });
    }

    updateVoucher(req, res) {
      connectToDB();
      Voucher.updateOne({ _id: req.params.id }, req.body)
      .then(() => {
        res.send("Voucher deleted");
      })
      .catch((error) => {
          console.error("Error update voucher:", error);
      });
    };
    
}

module.exports = new VoucherController();
