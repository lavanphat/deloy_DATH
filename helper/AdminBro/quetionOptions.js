
const fields = [
  'course',
  'user',
  'title',
  'lecture',
  'content',
  'reply',
  'status',
];

const questionOptions = {
  parent: { name: 'Danh mục' },
  name: 'Câu hỏi',
  listProperties: fields.filter(
    (item) => item !== 'content' && item !== 'reply'
  ),
  filterProperties: fields,
  // actions: renameActions,
};

exports.questionOptions = questionOptions;
