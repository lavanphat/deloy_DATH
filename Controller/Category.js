const Category = require('../model/category');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll
} = require('../Controller/HandleFactory');

exports.createCate = createOne(Category);
exports.getAllCate = getAll(Category, ['topics', 'courses']);
exports.getCate = getOne(Category, 'courses');
exports.updateCate = updateOne(Category);
exports.deleteCate = deleteOne(Category);
