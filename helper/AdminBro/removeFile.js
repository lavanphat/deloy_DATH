const fs = require('fs');
const removeFile = (links) => {
  links.forEach((item) => fs.unlink(item, (err) => {
    if (err)
      throw err;
    console.log('File delete');
  }));
};
exports.removeFile = removeFile;
