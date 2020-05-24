const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Mã giảm giá phải có code'],
      unique: [true, 'Tên khóa học bị trùng'],
      trim: true,
    },
    quality: { type: Number, required: [true, 'Mã phải có số lượng'] },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Danh mục không được để trống'],
    },
    reduction: {
      type: Number,
      required: [true, 'Chưa nhập phần trăm muốn giảm'],
      max: [100, 'Giảm tối đa 100%'],
      min: [1, 'Giảm tối thiểu 1%'],
    },
    minimize: { type: Number, required: [true, 'Phải có số tiền giảm tối đa'] },
    expired: {
      type: Date,
      required: [true, 'Mã giảm giá phải có ngày hết hạn'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

couponSchema.index({ expired: 1 }, { expireAfterSeconds: 0 });

couponSchema.pre('save', function (next) {
  this.code = this.code.replace(' ', '').toUpperCase();
  next();
});

couponSchema.plugin(beautifyUnique, {
  defaultMessage: 'Mã giảm giá này đã tồn tại',
});

// new Date(new Date().setHours(0, 0, 0, 0) + 7 * 24 * 60 * 60 * 1000)
//Export the model
module.exports = mongoose.model('Coupon', couponSchema);
