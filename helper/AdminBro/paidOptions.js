const paidOptions = {
  parent: { name: 'Danh mục' },
  name: 'Thanh toán',
  listProperties: ['course', 'user', 'price', 'status'],
  filterProperties: ['course', 'user', 'price', 'status', 'createdAt'],
  // editProperties: ['status'],
  sort: { direction: 'desc', sortBy: 'createdAt' },
  actions: {
    // ...renameActions,
    bulkDelete: { isVisible: false },
    // new: { isVisible: false },
    delete: { isVisible: false },
  },
};
exports.paidOptions = paidOptions;
