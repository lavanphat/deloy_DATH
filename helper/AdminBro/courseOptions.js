const { handlerNewCourse } = require("./handlerNewCourse");
const { handlerUpdateCourse } = require("./handlerUpdateCourse");
const AdminBro = require('admin-bro');

const courseOptions = {
  parent: { name: 'Danh mục' },
  name: 'Khóa học',
  listProperties: [
    'name',
    'price',
    'duration',
    'studentQuantity',
    'ratingAverage',
    'status',
  ],
  filterProperties: [
    'name',
    'createBy',
    'price',
    'duration',
    'ratingAverage',
    'category',
    'topic',
    'status',
    'createdAt',
  ],
  editProperties: [
    'name',
    'createBy',
    'description',
    'detailDescription',
    'learningWhat',
    'thumnail',
    'price',
    'section',
    'category',
    'topic',
    'status',
  ],
  sort: { direction: 'desc', sortBy: 'createdAt' },
  properties: {
    section: {
      components: {
        show: AdminBro.bundle('../CustomAdminUI/ShowCourse'),
        edit: AdminBro.bundle('../CustomAdminUI/EditSectionCourse'),
      },
    },
    thumnail: {
      components: {
        edit: AdminBro.bundle('../CustomAdminUI/EditThumnail'),
        show: AdminBro.bundle('../CustomAdminUI/ShowThumnail'),
      },
    },
    description: { type: 'richtext' },
    detailDescription: { type: 'richtext' },
    learningWhat: { type: 'richtext' },
  },
  actions: {
    // ...renameActions,
    new: {
      // ...renameActions.new,
      handler: handlerNewCourse,
    },
    edit: {
      // ...renameActions.edit,
      handler: handlerUpdateCourse,
    },
  },
};
exports.courseOptions = courseOptions;
