const express = require('express');
const multer = require('multer');
const path = require('path');
const { checkLogin, checkPermission } = require('../Controller/Auth');
const AppError = require('../helper/AppError');
const {
  getAllCourse,
  createCourse,
  getCourse,
  updateCourse,
  hideCourse,
  deleteCourse,
  uploadVideo,
  getCourseActive,
  searchByName,
} = require('../Controller/Course');

const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../upload'));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    var ext = path.extname(file.originalname);
    if (
      ext !== '.mp4' &&
      !file.mimetype.startsWith('image/') &&
      !file.mimetype.startsWith('text/')
    ) {
      return cb(new AppError('Định dạng video phải là mp4 hoặc hình ảnh', 400));
    }
    cb(null, true);
  },
});

//------ Router -------
router
  .route('/')
  .get(getCourseActive, getAllCourse)
  .post(
    checkLogin,
    checkPermission('Teacher', 'Admin'),
    upload.any(),
    uploadVideo,
    createCourse
  );
router.route('/search').get(searchByName);

router
  .route('/:id')
  .get(getCourse)
  .put(
    checkLogin,
    checkPermission('Teacher', 'Admin'),
    upload.any(),
    uploadVideo,
    updateCourse
  )
  .patch(checkLogin, checkPermission('Teacher', 'Admin'), hideCourse)
  .delete(checkLogin, checkPermission('Teacher', 'Admin'), deleteCourse);

router.route('/detail/*.:id').get(getCourse);

router.use('/:id/reviews', require('./review'));
router.use('/:id/question', require('./question'));

module.exports = router;
