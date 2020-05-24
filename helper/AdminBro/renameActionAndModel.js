const renameActions = {
  new: 'Tạo mới',
  edit: 'Sửa',
  list: 'Danh sách',
  show: 'Chi tiết',
  delete: 'Xóa',
  search: 'Lọc',
  // guard: 'Bạn có thực sự muốn xóa ?',
};
const renameActionAndModel = {
  language: 'vn',
  translations: {
    labels: {
      User: 'Người dùng',
      Category: 'Danh mục',
      Topic: 'Chủ đề',
      Course: 'Khóa học',
      Review: 'Đánh giá',
      Paid: 'Thanh toán',
      Coupon: 'Mã giảm giá',
      Question: 'Câu hỏi',
    },
    resources: {
      User: {
        actions: renameActions,
      },
      Category: {
        actions: renameActions,
      },
      Topic: {
        actions: renameActions,
      },
      Course: {
        actions: renameActions,
      },
      Review: {
        actions: renameActions,
      },
      Paid: {
        actions: renameActions,
      },
      Coupon: {
        actions: renameActions,
      },
      Question: {
        actions: renameActions,
      },
    },
  },
};

exports.renameActionAndModel = renameActionAndModel;
