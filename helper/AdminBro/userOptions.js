const userOptions = {
  parent: { name: 'Danh mục' },
  name: 'Người dùng',
  listProperties: ['email', 'fristName', 'lastName', 'role', 'isActive'],
  filterProperties: [
    'email',
    'fristName',
    'lastName',
    'role',
    'isActive',
    'createdAt',
    'updatedAt',
  ],
  showProperties: [
    'email',
    'fristName',
    'lastName',
    'photo',
    'role',
    'createdAt',
    'isActive',
  ],
  editProperties: [
    'fristName',
    'lastName',
    'email',
    'password',
    'passwordConfirm',
    'role',
    'isActive',
  ],
  sort: { direction: 'desc', sortBy: 'createdAt' },
  // actions: renameActions,
  properties: {
    password: { type: 'password' },
  },
};
exports.userOptions = userOptions;
