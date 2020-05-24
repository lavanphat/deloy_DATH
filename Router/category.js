const express = require('express');
const router = express.Router();
const {
  createCate,
  getAllCate,
  getCate,
  updateCate,
  deleteCate
} = require('../Controller/Category');
const { checkLogin, checkPermission } = require('../Controller/Auth');

router
  .route('/')
  .get(getAllCate)
  .post(checkLogin, checkPermission('Admin'), createCate);

router
  .route('/:id')
  .get(getCate)
  .put(checkLogin, checkPermission('Admin'), updateCate)
  .delete(checkLogin, checkPermission('Admin'), deleteCate);

router.route('/detail/*.:id').get(getCate);

module.exports = router;
