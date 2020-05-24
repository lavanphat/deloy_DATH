const express = require('express');
const router = express.Router();
const {
  createTopic,
  getAllTopic,
  checkCate,
  getTopic,
  updateTopic,
  deleteTopic
} = require('../Controller/Topic');
const { checkLogin, checkPermission } = require('../Controller/Auth');

router
  .route('/')
  .get(getAllTopic)
  .post(checkLogin, checkPermission('Admin'), checkCate, createTopic);

router
  .route('/:id')
  .get(getTopic)
  .put(checkLogin, checkPermission('Admin'), checkCate, updateTopic)
  .delete(checkLogin, checkPermission('Admin'), deleteTopic);

module.exports = router;
