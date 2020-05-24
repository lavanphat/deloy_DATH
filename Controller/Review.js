const Review = require('../model/review');
const Course = require('../model/course');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll
} = require('../Controller/HandleFactory');
const AppError = require('../helper/AppError');

// teacher ko được đánh giá khóa học của chình mình
exports.setCourseUserId = async (req, res, next) => {
  if (!req.body.course) req.body.course = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;
  const noReview = await Course.findOne({
    _id: req.body.course,
    createBy: req.body.user
  });

  if (noReview) {
    return next(
      new AppError('Bạn khôn thể đánh giá khóa học của chính mình', 400)
    );
  }

  next();
};

// tạo review
exports.createReview = createOne(Review);

// xem all review
exports.getAllReview = getAll(Review, 'user');

// xem review
exports.getReview = getOne(Review, 'user');

// sửa review
exports.updateReview = updateOne(Review, 'user');

// xóa review
exports.deleteReview = deleteOne(Review, 'user');
