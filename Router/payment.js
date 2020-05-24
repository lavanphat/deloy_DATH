const express = require('express');
const router = express.Router();
const { checkOut, checkOutCallBack } = require('../Controller/Payment');

router.route('/checkout').post(checkOut);
router.route('/:gateway/callback').get(checkOutCallBack);

module.exports = router;
