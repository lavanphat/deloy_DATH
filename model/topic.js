const mongoose = require('mongoose'); // Erase if already required
const slugify = require('slugify');

// Declare the Schema of the Mongo model
var topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề không được trống']
    },
    slug: {
      type: String
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Danh mục không được để trống']
      }
    ]
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

topicSchema.virtual('courses', {
  ref: 'Course',
  foreignField: 'topic',
  localField: '_id'
});

topicSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

topicSchema.pre(/^find/, function(next) {
  // this.populate({ path: 'category', select: '-__v' });
  next();
});

//Export the model
module.exports = mongoose.model('Topic', topicSchema);
