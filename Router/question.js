const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createQuestion,
  deleteQuestion,
  getAllQuestion,
  getQuestion,
  updateQuestion,
  addReplyQuestion,
  editReplyQuestion,
  removeReplyQuestion,
} = require('../Controller/Question');
const { checkLogin } = require('../Controller/Auth');

router.route('/').get(getAllQuestion).post(checkLogin, createQuestion);

router
  .route('/:id')
  .get(getQuestion)
  .put(checkLogin, updateQuestion)
  .delete(checkLogin, deleteQuestion);

router.route('/:id/reply').post(checkLogin, addReplyQuestion);
router
  .route('/:id/reply/:idReply')
  .put(checkLogin, editReplyQuestion)
  .delete(checkLogin, removeReplyQuestion);

module.exports = router;
