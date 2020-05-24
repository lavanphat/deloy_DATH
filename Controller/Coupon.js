const Coupon = require('../model/coupon');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('../Controller/HandleFactory');
const tryCatch = require('../helper/TryCatch');
const AppError = require('../helper/AppError');

exports.createCoupon = createOne(Coupon);
exports.getAllCoupon = getAll(Coupon);
exports.getCoupon = getOne(Coupon);
exports.deleteCoupon = deleteOne(Coupon);
exports.updateCoupon = updateOne(Coupon);

exports.checkCoupon = tryCatch(async (req, res, next) => {
  const { code } = req.query;

  const coupon = await Coupon.findOne({ code });

  if (!coupon) {
    return next(new AppError('Mã đã hết hoặc không hợp lệ', 404));
  }

  if (coupon.quality < 1) {
    return next(new AppError('Mã đã hết lượt', 404));
  }

  res.status(200).json({
    status: 'success',
    data: coupon,
  });
});
