const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var questionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Chưa nhập thông tin khóa học'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Chưa nhập user'],
    },
    lecture: {
      type: String,
      required: [true, 'Câu hỏi phải được đặt cho bài giảng nào'],
    },
    title: {
      type: String,
      required: [true, 'Câu hỏi phải tiêu đề'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Câu hỏi phải có nội dung'],
      trim: true,
    },
    reply: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: [true, 'Chưa nhập user'],
        },
        content: {
          type: String,
          required: [true, 'Câu hỏi phải nội dung'],
          trim: true,
        },
        createdAt: { type: Date, default: Date.now },
        status: { type: String, default: true },
      },
    ],
    status: { type: String, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Export the model
module.exports = mongoose.model('Question', questionSchema);
