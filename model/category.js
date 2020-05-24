const mongoose = require('mongoose'); // Erase if already required
const slugify = require('slugify');

// Declare the Schema of the Mongo model
var categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề không được trống'],
      unique: [true, 'Tiêu đề đã có']
    },
    slug: {
      type: String
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

categorySchema.virtual('topics', {
  ref: 'Topic',
  foreignField: 'category',
  localField: '_id'
});

categorySchema.virtual('courses', {
  ref: 'Course',
  foreignField: 'category',
  localField: '_id',
  options: { sort: { ratingAverage: -1 }, limit: 20 }
});

categorySchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

//Export the model
module.exports = mongoose.model('Category', categorySchema);
