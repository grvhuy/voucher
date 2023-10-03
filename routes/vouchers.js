const express = require('express');
const router = express.Router();

const voucherControllers = require("../controllers/voucherController")

router.get('/', voucherControllers.showVouchers);

router.get('/:id', voucherControllers.getVoucher);

router.post('/create', voucherControllers.createVoucher);

router.delete('/:id', voucherControllers.deleteVoucher);

router.patch('/:id', voucherControllers.updateVoucher);


module.exports = router;