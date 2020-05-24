const Topic = require('../model/topic');
const Category = require('../model/category');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll
} = require('./HandleFactory');
const tryCatch = require('../helper/TryCatch');
const AppError = require('../helper/AppError');

// kiểm tra category có tồn tại
exports.checkCate = tryCatch(async (req, res, next) => {
  const { category } = req.body;
  console.log(category);
  const cate = await Category.findOne({ _id: category });
  console.log(cate);
  if (!cate) {
    return next(new AppError('Không tìm thấy danh mục này!', 404));
  }

  next();
});

exports.createTopic = createOne(Topic);
exports.getAllTopic = getAll(Topic);
exports.getTopic = getOne(Topic, 'courses');
exports.updateTopic = updateOne(Topic);
exports.deleteTopic = deleteOne(Topic);
