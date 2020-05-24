const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var paidSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Thanh toán phải có khóa học'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Thanh toán phải có user'],
    },
    price: {
      type: Number,
      required: [true, 'Thanh toán phải có giá'],
    },
    proccess: [String],
    status: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

paidSchema.index({ course: 1, user: 1 }, { unique: true });

paidSchema.pre(/^find/, function (next) {
  this.find({ status: { $eq: true } });
  next();
});

paidSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

//Export the model
module.exports = mongoose.model('Paid', paidSchema);
