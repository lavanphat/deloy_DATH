const mongoose = require('mongoose');
const { DATABASE } = require('../config/key');

exports = mongoose.connect(
  DATABASE,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  },
  err => {
    if (!err) {
      console.log('MongoDB Connection Succeeded.');
    } else {
      console.log('Error in DB connection: ' + err);
    }
  }
);
