const { beforeNewReview } = require('./beforeNewReview');
const reviewOptions = {
  parent: { name: 'Danh mục' },
  name: 'Đánh giá',
  listProperties: ['_id', 'review', 'rating', 'course', 'user'],
  filterProperties: [
    'review',
    'rating',
    'course',
    'user',
    'createdAt',
    'updatedAt',
  ],
  editProperties: ['review', 'rating', 'course'],
  sort: { direction: 'desc', sortBy: 'createdAt' },
  actions: {
    // ...renameActions,
    new: { before: beforeNewReview },
  },
};
exports.reviewOptions = reviewOptions;
