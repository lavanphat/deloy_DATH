const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const AppError = require('./helper/AppError');
const { handleError } = require('./Controller/Error');
const { router } = require('./helper/AdminBro');
const path = require('path');
global.User = require('./model/user');

const app = express();
//MIDDLEWARE
app.use(cors());
app.use(helmet());
// app.use(
//   '/api',
//   rateLimit({
//     max: 100,
//     windowMs: 1000 * 60 * 30,
//     message:
//       'Bạn đã gửi quá nhiều yêu cầu tới server. Xin thử lại trong 30 phút nữa'
//   })
// );

//kết nối mongo
require('./helper/mongo');
//kết nối admin bro
// app.use(adminBro.options.rootPath, router);
app.use('/admin', router);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// bảo mật hơn cho mongo
app.use(mongoSanitize());
// ngăn chặn người dùng nhập dạng $gt
app.use(xss());
// ngăn chặn người dùng nhập dạng html
app.use(hpp());
//Kết nối React

//ROUTER
app.use('/api/course', require('./Router/course'));
app.use('/api/user', require('./Router/user'));
app.use('/api/category', require('./Router/category'));
app.use('/api/topic', require('./Router/topic'));
app.use('/api/review', require('./Router/review'));
app.use('/api/question', require('./Router/question'));
app.use('/api/paid', require('./Router/paid'));
app.use('/api/payment', require('./Router/payment'));
app.use('/api/coupon', require('./Router/coupon'));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// router 404
app.get('*', (req, res, next) => {
  next(new AppError(`Không tìm thấy địa chỉ ${req.originalUrl}`, 404));
});

app.use(handleError);

console.log(process.env.PORT);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
