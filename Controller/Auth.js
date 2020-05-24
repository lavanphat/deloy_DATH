const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const AppError = require('../helper/AppError');
const tryCatch = require('../helper/TryCatch');
const User = require('../model/user');
const Paid = require('../model/paid');
const Course = require('../model/course');
const { JWT_SECRET, JWT_TIME, HOST_SEND_MAIL } = require('../config/key');
const sendEmail = require('../helper/Email');

//tạo token gửi cho client
const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_TIME,
  });
};

//authorization
const authorization = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Bạn cần phải đăng nhập', 401));
  }

  const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
  const user = await User.findById(decoded.id).populate('myCourses');

  if (!user) {
    return next(new AppError('Tài khoản không còn tồn tại', 401));
  }
  if (user.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'Người dùng gần đây đã thay đổi mật khẩu! Xin vui lòng đăng nhập lại',
        401
      )
    );
  }

  return user;
};

//popular coursesBuy and myCourses
const getCourseBuyAndMyCourse = async (user) => {
  const coursesBuy = await Paid.aggregate([
    [
      {
        $match: {
          user: user._id,
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'course',
        },
      },
      {
        $unwind: {
          path: '$course',
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'course.createBy',
          foreignField: '_id',
          as: 'course.createBy',
        },
      },
      {
        $unwind: {
          path: '$course.createBy',
        },
      },
    ],
  ]);
  let myCourses = await Course.aggregate([
    {
      $match: {
        createBy: user._id,
      },
    },
  ]);
  let favoriteCourse = await User.aggregate([
    {
      $match: {
        _id: user._id,
      },
    },
    {
      $project: {
        favoriteCourse: 1,
        _id: 0,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'favoriteCourse',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: {
        path: '$course',
      },
    },
    {
      $project: {
        favoriteCourse: 0,
      },
    },
  ]);

  myCourses = myCourses.reduce((result, item) => {
    result.push({ course: item });
    return result;
  }, []);
  return {
    ...user['_doc'],
    coursesBuy,
    myCourses,
    favoriteCourse: favoriteCourse,
  };
};

// đăng ký
exports.signUp = tryCatch(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signToken(newUser.id);

  res.status(201).json({
    status: 'success',
    token,
    data: newUser,
  });
});

// đăng nhập
exports.signIn = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Vui lòng nhập email và mật khẩu', 400));
  }

  let user = await User.findOne({ email })
    .populate('coursesBuy myCourses')
    .select('+password');
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Email hoặc mật khẩu sai', 401));
  }

  const token = signToken(user.id);
  user = await getCourseBuyAndMyCourse(user);
  res.status(200).json({
    status: 'success',
    token,
    data: user,
  });
});

// đăng nhập với Google
exports.signInSocial = tryCatch(async (req, res, next) => {
  if (!req.user) {
    return res.send(401, 'User Not Authenticated');
  }

  const token = signToken(req.user.id);
  req.user = await getCourseBuyAndMyCourse(req.user);

  res.status(200).json({
    status: 'success',
    token,
    data: req.user,
  });
});

// api authorization
exports.auth = tryCatch(async (req, res, next) => {
  let user = await authorization(req, res, next);
  if (user) {
    user = await getCourseBuyAndMyCourse(user);
    res.status(200).json({
      status: 'success',
      data: user,
    });
  }
});

// kiểm tra đăng nhập
exports.checkLogin = tryCatch(async (req, res, next) => {
  req.user = await authorization(req, res, next);
  next();
});

// kiểm tra quyền user
exports.checkPermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Bạn không có quyền truy cập', 403));
    }

    next();
  };
};

// quên mật khẩu
exports.forgotPassword = tryCatch(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('Email không tồn tại!', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const url = HOST_SEND_MAIL || req.headers.host;
  let resetPassword = `${req.protocol}://${url}/user/reset-password/${resetToken}`;

  try {
    sendEmail(user.email, 'Đặt lại mật khẩu', resetPassword);
    res.status(200).json({
      status: 'success',
      message: 'Mã đã gửi đến mail. Mã chỉ có hiệu lực trong 10 phút',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    return next(
      new AppError('Có lỗi trong quá trình gửi mail. Hãy thử lại!', 500)
    );
  }
});

// đặt lại mật khẩu
exports.resetPassword = tryCatch(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token không hợp lệ hoặc đã hết hạn!', 400));
  }
  if (!req.body.password || !req.body.passwordConfirm) {
    return next(new AppError('Chưa nhập mật khẩu mới', 400));
  }
  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError('Mật khẩu không trùng nhau', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Đã thay đổi mật khẩu. Xin vui lòng đăng nhập lại!',
  });
});

// đổi mật khẩu
exports.changePassword = tryCatch(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  const { password, passwordNew, passwordConfirm } = req.body;

  if (!user) {
    return next(new AppError('Tài khoản không tồn tại', 400));
  }
  if (!password || !passwordNew || !passwordConfirm) {
    return next(new AppError('Chưa nhập mật khẩu mới', 400));
  }
  if (!(await user.comparePassword(password, user.password))) {
    return next(new AppError('Nhập mật khẩu hiện tại không đúng', 400));
  }
  if (passwordNew !== passwordConfirm) {
    return next(new AppError('Mật khẩu mới không trùng nhau', 400));
  }

  user.password = req.body.passwordNew;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Đã thay đổi mật khẩu. Xin vui lòng đăng nhập lại!',
  });
});
