const AppError = require('../helper/AppError');
const tryCatch = require('../helper/TryCatch');
const User = require('../model/user');
const Course = require('../model/course');
const { getOne } = require('../Controller/HandleFactory');

// lọc ra những trường cần lấy
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// lấy thông tin
exports.getUser = getOne(User, ['coursesBuy', 'myCourses']);

// sửa thông tin
exports.updateMe = tryCatch(async (req, res, next) => {
  const { password, passwordNew, passwordConfirm } = req.body;
  if (password || passwordConfirm || passwordNew) {
    return next(new AppError('Không thể đổi mật khẩu ở đây', 400));
  }

  const filteredBody = filterObj(
    req.body,
    'fristName',
    'lastName',
    'photo',
    'isActive'
  );
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: false,
  });

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

// xóa tài khoản
exports.deleteMe = tryCatch(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });

  res.status(200).json({
    status: 204,
    message: 'Bạn đã xóa tài khoản. Bạn sẽ đăng xuất sau 5 giây',
  });
});

exports.addFavoriteCourse = tryCatch(async (req, res, next) => {
  const course = await Course.findById(req.body.courseId);

  if (!course) {
    return next(new AppError('Khóa học không tồn tại', 400));
  }

  await User.findByIdAndUpdate(req.user.id, {
    $addToSet: { favoriteCourse: course._id },
  });

  res.status(200).json({
    status: 204,
    message: 'Bạn đã thêm khóa học vào yêu thích',
  });
});

exports.removeFavoriteCourse = tryCatch(async (req, res, next) => {
  const course = await Course.findById(req.body.courseId);

  if (!course) {
    return next(new AppError('Khóa học không tồn tại', 400));
  }

  await User.findByIdAndUpdate(req.user.id, {
    $pullAll: { favoriteCourse: [course._id] },
  });

  res.status(200).json({
    status: 204,
    message: 'Bạn đã xóa khóa học khỏi yêu thích',
  });
});
