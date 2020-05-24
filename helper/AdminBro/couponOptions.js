const fields = [
  'code',
  'quality',
  'category',
  'reduction',
  'minimize',
  'expired',
];

const couponOptions = {
  parent: { name: 'Danh mục' },
  name: 'Mã giảm giá',
  listProperties: fields,
  filterProperties: fields,
  // actions: renameActions,
};

exports.couponOptions = couponOptions;
