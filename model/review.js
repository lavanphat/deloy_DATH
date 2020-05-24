const mongoose = require('mongoose'); // Erase if already required
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const Course = require('../model/course');

// Declare the Schema of the Mongo model
var reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      trim: true,
      required: [true, 'Nội dung đánh giá không được để trống'],
    },
    rating: {
      type: Number,
      max: [5, 'Đánh giá cao nhất là 5'],
      min: [1, 'Đánh giá thấp nhất là 1'],
      required: [true, 'Số điểm đánh giá không được để trống'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Đánh giá phải có id khóa học'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Đánh giá phải có id user'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// reviewSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'user',
//   });

//   next();
// });

reviewSchema.index({ course: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAvgRating = async function (courseID) {
  const stats = await this.aggregate([
    { $match: { course: courseID } },
    {
      $group: {
        _id: '$course',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  let createBy = null;

  if (stats.length > 0) {
    const course = await Course.findByIdAndUpdate(courseID, {
      ratingQuantity: stats[0].nRating,
      ratingAverage: stats[0].avgRating,
    });
    createBy = course.createBy._id;
  } else {
    const course = await Course.findByIdAndUpdate(courseID, {
      ratingAverage: 0,
      ratingQuantity: 0,
    });
    createBy = course.createBy._id;
  }
  
  const countReviews = await Course.aggregate([
    {
      $match: {
        createBy: createBy,
      },
    },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'course',
        as: 'reviews',
      },
    },
    {
      $unwind: '$reviews',
    },
    {
      $project: {
        _id: 0,
        createBy: 1,
        reviews: '$reviews.rating',
      },
    },
    {
      $group: {
        _id: '$createBy',
        countReviews: {
          $sum: 1,
        },
        avgRating: {
          $avg: '$reviews',
        },
      },
    },
  ]);
  await User.findByIdAndUpdate(createBy, {
    countReviews: countReviews[0].countReviews,
    avgRating: countReviews[0].avgRating,
  });
};

reviewSchema.post('save', function () {
  this.constructor.calcAvgRating(this.course);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  if (this.r) await this.r.constructor.calcAvgRating(this.r.course);
});

reviewSchema.plugin(beautifyUnique, {
  defaultMessage: 'Bạn đã đánh giá khóa học này',
});

//Export the model
module.exports = mongoose.model('Review', reviewSchema);
