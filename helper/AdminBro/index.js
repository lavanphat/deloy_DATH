const { renameActionAndModel } = require("./renameActionAndModel");
const { dashboard } = require('./dashboard');
const { cateOptions } = require('./cateOptions');
const { topicOptions } = require('./topicOptions');
const { courseOptions } = require('./courseOptions');
const { reviewOptions } = require('./reviewOptions');
const { paidOptions } = require('./paidOptions');
const { userOptions } = require('./userOptions');
const { couponOptions } = require('./couponOptions');
const { renameBranding } = require('./renameBranding');
const { questionOptions } = require('./quetionOptions');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../model/user');
const Category = require('../../model/category');
const Topic = require('../../model/topic');
const Course = require('../../model/course');
const Review = require('../../model/review');
const Paid = require('../../model/paid');
const Coupon = require('../../model/coupon');
const Question = require('../../model/question');
const mongo = require('mongoose');

AdminBro.registerAdapter(AdminBroMongoose);

exports.adminBro = new AdminBro({
  databases: [mongo],
  rootPath: '/admin',
  resources: [
    {
      resource: User,
      options: userOptions,
    },
    {
      resource: Category,
      options: cateOptions,
    },
    {
      resource: Topic,
      options: topicOptions,
    },
    {
      resource: Course,
      options: courseOptions,
    },
    {
      resource: Review,
      options: reviewOptions,
    },
    {
      resource: Paid,
      options: paidOptions,
    },
    { resource: Coupon, options: couponOptions },
    { resource: Question, options: questionOptions },
  ],
  branding: renameBranding,
  dashboard: {
    handler: dashboard,
    component: AdminBro.bundle('../CustomAdminUI/Dashboard'),
  },
  pages: {
    'push-notification': {
      name: 'Thông báo khuyến mãi',
      component: AdminBro.bundle('../CustomAdminUI/Notification'),
    },
  },
  locale: renameActionAndModel,
});

exports.router = AdminBroExpress.buildAuthenticatedRouter(
  this.adminBro,
  {
    authenticate: async (email, password) => {
      const user = await User.findOne({ email, role: 'Admin' }).select(
        '+password'
      );
      if (user) {
        const matched = await bcrypt.compare(password, user.password);
        if (matched) {
          return user;
        }
      }
      return false;
    },
    cookiePassword: 'some-secret-password-used-to-secure-cookie',
  },
  null,
  {
    resave: false,
    cookie: { expires: new Date(Date.now() + 30 * 86400 * 1000) },
    saveUninitialized: true,
    secret: 'login',
  }
);
exports.router = AdminBroExpress.buildRouter(this.adminBro);
