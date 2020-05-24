const express = require('express');
const router = express.Router();
const { checkLogin, checkPermission } = require('../Controller/Auth');
const {
  createPaid,
  getAllPaid,
  hidePaid,
  updatePaid,
} = require('../Controller/Paid');

router.route('/').get(checkLogin, getAllPaid).post(checkLogin, createPaid);

router
  .route('/:id')
  .patch(checkLogin, checkPermission('Admin'), hidePaid)
  .put(checkLogin, updatePaid);
//   .get(getCate)
//   .delete(checkLogin, checkPermission('Admin'), deleteCate);

module.exports = router;
