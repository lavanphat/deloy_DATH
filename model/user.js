const mongoose = require('mongoose'); // Erase if already required
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    fristName: {
      type: String,
      required: [true, 'Họ không được để trống'],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Tên không được để trống'],
    },
    email: {
      type: String,
      required: [true, 'Email ko được để trống'],
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
      validate: [validator.isEmail, 'Địa chỉ email không hợp lệ'],
    },
    google: {
      type: { id: String, token: String },
      select: false,
    },
    facebook: {
      type: { id: String, token: String },
      select: false,
    },
    photo: {
      type: String,
      default: 'default.webp',
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Mật khẩu không được để trống'],
      minlength: [8, 'Mật khẩu phải có ít nhất 8 kí tự'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      trim: true,
      required: [true, 'Xác nhận mật khẩu không được để trống'],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: 'Mật khẩu không trùng nhau',
      },
    },
    role: {
      type: String,
      required: true,
      trim: true,
      enum: {
        values: ['User', 'Teacher', 'Admin'],
        message: 'Quyền phải là: User, Teacher, Admin',
      },
      default: 'User',
    },
    passwordChangeAt: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    isActive: { type: Boolean, default: true, select: false },
    countMyCourse: { type: Number, default: 0 },
    countReviews: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    favoriteCourse: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.index({ fristName: 'text', lastName: 'text' });
userSchema.index({ fristName: 1 });
userSchema.index({ lastName: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ isActive: true });
  next();
});

userSchema.virtual('coursesBuy', {
  ref: 'Paid',
  foreignField: 'user',
  localField: '_id',
});

userSchema.virtual('myCourses', {
  ref: 'Course',
  foreignField: 'createBy',
  localField: '_id',
});

userSchema.methods.comparePassword = async function (
  newPassword,
  userPassword
) {
  return await bcrypt.compare(newPassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTtimestamp) {
  if (this.passwordChangeAt) {
    const changeTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    return JWTtimestamp < changeTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 1000 * 60 * 10;
  return resetToken;
};

userSchema.plugin(beautifyUnique, {
  defaultMessage: 'Email đã được đăng ký',
});

//Export the model
module.exports = mongoose.model('User', userSchema);
