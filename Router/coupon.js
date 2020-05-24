const express = require('express');
const router = express.Router();
const {
  createCoupon,
  getAllCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  checkCoupon,
} = require('../Controller/Coupon');

router.route('/').get(getAllCoupon).post(createCoupon);
router.route('/check-coupon').get(checkCoupon);
router.route('/:id').get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
