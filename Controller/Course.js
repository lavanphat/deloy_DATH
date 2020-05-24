const Course = require('../model/course');
const tryCatch = require('../helper/TryCatch');
const AppError = require('../helper/AppError');
const { uploadFile } = require('../helper/CloudStorage');
const { getVideoDurationInSeconds } = require('get-video-duration');
const _ = require('lodash');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('../Controller/HandleFactory');
const bcrypt = require('bcryptjs');
const fullTextSearchVi = require('fulltextsearch').vi;

exports.setCreateBy = (req, res, next) => {
  if (!req.body.createBy) req.body.createBy = req.user.id;
  next();
};

exports.getCourseActive = (req, res, next) => {
  const status = ['processing', 'active', 'hide', 'all'];

  if (!req.query.status) {
    return next(new AppError('Bạn phải nhập status', 404));
  }

  const newStatus = status.find((item) =>
    bcrypt.compareSync(item, req.query.status)
  );
  if (!newStatus) return next(new AppError('Status sai', 404));
  req.query.status = newStatus;
  if (req.query.status === 'all') delete req.query.status;

  next();
};

// Lấy tất cả khóa học
module.exports.getAllCourse = getAll(Course);

//Lấy khóa học theo id
module.exports.getCourse = getOne(Course, ['reviews', 'author']);

// Tạo khóa học mới
module.exports.createCourse = createOne(Course);

//Sửa khóa học
module.exports.updateCourse = updateOne(Course, 'createBy');

//Ẩn khóa học
module.exports.hideCourse = tryCatch(async (req, res, next) => {
  const doc = await Course.findOneAndUpdate(
    { _id: req.params.id, createBy: req.user.id },
    { status: 'hide' },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!doc) {
    return next(new AppError('Không tìm thấy khóa học', 404));
  }

  res.status(201).json({
    status: 'success',
    data: doc,
  });
});

//Xóa khóa học
module.exports.deleteCourse = deleteOne(Course, 'createBy');

//upload video lên gcs, lấy url lưu vào req.body
module.exports.uploadVideo = tryCatch(async (req, res, next) => {
  if (!req.files) {
    return next();
  }
  if (req.files.length <= 0) {
    return next();
  }
  const files = {};
  let thumnail = {};
  let durationCourse = 0;

  _.chain(req.files)
    .map('fieldname')
    .uniq()
    .forEach((section) => {
      if (section !== 'thumnail') {
        files[section] = req.files.filter((file) =>
          file.fieldname === section ? file : null
        );
      } else {
        req.files.forEach((file) => {
          file.fieldname === section ? (thumnail = file) : null;
        });
      }
    })
    .value();

  const listVideos = Object.keys(files);
  if (req.method.toLowerCase() === 'post') {
    await Promise.all(
      listVideos.map(async (listVideo, i) => {
        if (files[listVideo].length !== req.body.section[i]['content'].length) {
          return next(
            new AppError(
              `Tiêu đề video và video ở chương ${i + 1} không bằng nhau`,
              400
            )
          );
        }
        const urls = await Promise.all(
          files[listVideo].map((file) => uploadFile(file, req.body.name))
        );

        await Promise.all(
          urls.map(async (url, j) => {
            const durationVideo = await getVideoDurationInSeconds(url);

            durationCourse += durationVideo;
            req.body.section[i]['content'][j]['duration'] = new Date(
              durationVideo * 1000
            )
              .toISOString()
              .substr(14, 5);
            req.body.section[i]['content'][j]['link'] = url;
          })
        );
      })
    );

    req.body.thumnail = await uploadFile(thumnail, req.body.name);
  } else if (req.method.toLowerCase() === 'put') {
    await Promise.all(
      listVideos.map(async (listVideo) => {
        const urls = await uploadFile(files[listVideo][0], req.body.name);
        const index = listVideo.match(/\d+/g);
        req.body['section'][index[0]]['content'][index[1]]['link'] = urls;

        const durationVideo = await getVideoDurationInSeconds(urls);
        durationCourse += durationVideo;
        req.body.section[index[0]]['content'][index[1]]['duration'] = new Date(
          durationVideo * 1000
        )
          .toISOString()
          .substr(14, 5);
      })
    );

    if (!_.isEmpty(thumnail)) {
      req.body.thumnail = await uploadFile(thumnail, req.body.name);
    }
  }
  req.body.duration
    ? (req.body.duration = parseInt(req.body.duration) + durationCourse)
    : (req.body.duration = durationCourse);
  next();
});

module.exports.searchByName = tryCatch(async (req, res, next) => {
  const { q, isCourseOnly, sort } = req.query;
  let result = [];

  const page = req.query.page * 1 || 1;
  const limit = isCourseOnly === 'true' ? 2 : 2;
  const skip = (page - 1) * limit;

  if (q) {
    let doc = await Course.find({
      $or: [
        { $text: { $search: q } },
        { name: { $regex: new RegExp(fullTextSearchVi(q), 'i') } },
      ],
    })
      .skip(skip)
      .limit(limit)
      .sort(sort);
    const doc1 = await User.find({
      $or: [
        { $text: { $search: q } },
        { fristName: { $regex: new RegExp(fullTextSearchVi(q), 'i') } },
        { lastName: { $regex: new RegExp(fullTextSearchVi(q), 'i') } },
      ],
    }).limit(limit);

    result = isCourseOnly === 'true' ? doc : doc.concat(doc1);
  }

  res.status(201).json({
    status: 'success',
    lenght: result.length,
    data: result,
  });
});
