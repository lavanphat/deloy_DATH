const Question = require('../model/question');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('../Controller/HandleFactory');
const AppError = require('../helper/AppError');
const tryCatch = require('../helper/TryCatch');

// tạo Question
exports.createQuestion = createOne(Question);

// xem all Question
exports.getAllQuestion = getAll(Question, 'user reply.user');

// xem Question
exports.getQuestion = getOne(Question, 'user');

// sửa Question
exports.updateQuestion = updateOne(Question, 'user', 'user reply.user');

// xóa Question
exports.deleteQuestion = deleteOne(Question, 'user');

// trả lời Question
exports.addReplyQuestion = tryCatch(async (req, res, next) => {
  const { id } = req.params;

  const replyQuestion = await Question.findByIdAndUpdate(
    id,
    {
      $push: { reply: req.body },
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate('user reply.user');

  if (!replyQuestion) {
    return next(new AppError('Không thể trả lời câu hỏi này', 404));
  }

  res.status(201).json({ status: 'success', data: replyQuestion });
});

// sửa câu trả lời Question
exports.editReplyQuestion = tryCatch(async (req, res, next) => {
  const { id, idReply } = req.params;

  const replyQuestion = await Question.findOneAndUpdate(
    { _id: id, 'reply._id': idReply },
    {
      $set: { 'reply.$.content': req.body.content },
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate('user reply.user');

  if (!replyQuestion) {
    return next(new AppError('Không thể trả lời câu hỏi này', 404));
  }

  res.status(201).json({ status: 'success', data: replyQuestion });
});

// xóa câu trả lời Question
exports.removeReplyQuestion = tryCatch(async (req, res, next) => {
  const { id, idReply } = req.params;

  await Question.findOneAndUpdate(
    { _id: id },
    {
      $pull: { reply: { _id: idReply } },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({ status: 'success', data: 'Đã xóa câu trả lời' });
});
