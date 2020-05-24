const Paid = require('../model/paid');
const {
  createOne,
  getAll,
  hideOne,
  updateOne,
} = require('../Controller/HandleFactory');

exports.createPaid = createOne(Paid);
exports.getAllPaid = getAll(Paid);
exports.hidePaid = hideOne(Paid);
// exports.getCate = getOne(Category, 'courses');
exports.updatePaid = updateOne(Paid);
// exports.deleteCate = deleteOne(Category);
