const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createReview,
  getAllReview,
  deleteReview,
  updateReview,
  setCourseUserId
} = require('../Controller/Review');
const { checkLogin, checkPermission } = require('../Controller/Auth');

router
  .route('/')
  .get(getAllReview)
  .post(checkLogin, setCourseUserId, createReview);

router
  .route('/:id')
  .put(checkLogin, checkPermission('User', 'Teacher'), updateReview)
  .delete(checkLogin, deleteReview);

module.exports = router;
