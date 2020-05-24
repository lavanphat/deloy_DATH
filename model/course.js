const mongoose = require('mongoose'); // Erase if already required
const slugify = require('slugify');

// Declare the Schema of the Mongo model
var courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên khóa học không được để trống'],
      unique: [true, 'Tên khóa học bị trùng'],
      trim: true,
      maxlength: [200, 'Tên khóa học chứa tối đa 200 kí tự'],
      minlength: [10, 'Tên khóa học chứa tối đa 10 kí tự'],
    },
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Người tạo không ko được để trống'],
    },
    description: {
      trim: true,
      type: String,
      required: [true, 'Mô tả ngắn không được để trống'],
    },
    detailDescription: {
      trim: true,
      type: String,
    },
    learningWhat: {
      trim: true,
      type: String,
      required: [true, '*Học được gì* không được bỏ trống'],
    },
    thumnail: {
      type: String,
      required: [true, 'Ảnh bìa không được bỏ trống'],
    },
    price: {
      type: Number,
      required: [true, 'Giá không được bỏ trống'],
      min: [0, 'Giá phải lớn hơn không'],
    },
    duration: {
      type: Number,
    },
    slug: {
      trim: true,
      type: String,
    },
    discount: {
      priceDiscount: {
        type: Number,
        validate: {
          validator: function (val) {
            return val < this.price;
          },
          message: 'Giá khuyến mãi phải nhỏ hơn giá gốc',
        },
      },
      start: {
        type: Date,
      },
      end: {
        type: Date,
      },
    },
    studentQuantity: {
      type: Number,
      default: 0,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: [0, 'Đánh giá thấp nhất là 1.0'],
      max: [5, 'Đánh giá cao nhất là 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    section: {
      type: [
        {
          title: {
            type: String,
            required: [true, 'Bạn chưa nhập tiêu đề cho chương'],
            trim: true,
          },
          content: {
            type: [
              {
                titleVideo: {
                  type: String,
                  trim: true,
                  required: [true, 'Bạn chưa nhập tiêu đề cho video'],
                },
                link: {
                  type: String,
                  trim: true,
                  required: [true, 'Bạn chưa nhập đường dẫn cho video'],
                },
                isTry: { type: Boolean, default: false },
                duration: String,
              },
            ],
            validate: [
              (value) => value.length > 0,
              'Chưa thêm các video cho khóa học',
            ],
          },
        },
      ],
      validate: [
        (value) => value.length > 0,
        'Chưa thêm các chương cho khóa học',
      ],
    },
    status: {
      type: String,
      enum: {
        values: ['processing', 'active', 'hide'],
        message: 'Trạng thái phải là: Đang xử lí, Kích hoạt, Khóa',
      },
      trim: true,
      default: 'processing',
      required: [true, 'Trạng thái không được để trống'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Danh mục không được để trống'],
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: [true, 'Topic không được để trống'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
courseSchema.index({ name: 'text' });
courseSchema.index({ name: 1 });

//------------STATICS--------------------
courseSchema.statics.calcCourse = async function (userID) {
  const stats = await this.aggregate([
    { $match: { createBy: userID, status: 'active' } },
    {
      $group: {
        _id: '$createBy',
        nCourse: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await User.findByIdAndUpdate(userID, {
      countMyCourse: stats[0].nCourse,
    });
  } else {
    await User.findByIdAndUpdate(userID, {
      countMyCourse: 0,
    });
  }
};

//------------PRE--------------------
courseSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

courseSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'createBy',
    select: 'fristName lastName countMyCourse countReviews avgRating',
  });
  next();
});

courseSchema.post('save', function () {
  this.constructor.calcCourse(this.createBy);
});

courseSchema.pre(/^findOneAnd/, async function (next) {
  let item = await this.find({});
  this.r = item[0];
  next();
});

courseSchema.post(/^findOneAnd/, async function () {
  if (this.r) await this.r.constructor.calcCourse(this.r.createBy._id);
});

//------------VIRTUAL--------------------
courseSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'course',
  localField: '_id',
});

courseSchema.virtual('author', {
  ref: 'User',
  foreignField: '_id',
  localField: 'createBy',
});

module.exports = mongoose.model('Course', courseSchema);
