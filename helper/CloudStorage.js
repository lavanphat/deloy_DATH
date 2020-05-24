const { storage } = require('../helper/GCS');
const util = require('util');
const { format } = util;
const fs = require('fs');

const bucket = storage.bucket('aerobic-forge-140010.appspot.com');
const removeFile = (path) => {
  fs.unlink(path, function (err) {
    if (err) return console.log(err);
  });
};

exports.uploadFile = (file, folder) =>
  new Promise((resolve, reject) => {
    let { filename, path } = file;

    folder = folder.replace(/ /g, '-');
    filename = filename.replace(/ /g, '-');
    const pathFolder = `${folder}/${filename}`;

    bucket.upload(path, { destination: pathFolder }, function (err) {
      removeFile(path);
      if (err) {
        console.log(err);
        reject(`Đã xảy ra lỗi`);
      }
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${pathFolder}`
      );
      resolve(publicUrl);
    });

    // fs.createReadStream(path)
    //   .pipe(blob.createWriteStream({ resumable: false, contentType: mimetype }))
    //   .on('finish', () => {
    //     const publicUrl = format(
    //       `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    //     );
    //     fs.unlink(path, function(err) {
    //       if (err) return console.log(err);
    //     });
    //     resolve(publicUrl);
    //   })
    //   .on('error', () => {
    //     fs.unlink(path, function(err) {
    //       if (err) return console.log(err);
    //     });
    //     reject(`Đã xảy ra lỗi`);
    //   });
  });

exports.deleteFile = async (name) => {
  try {
    const blob = bucket.file(name);

    const file = await blob.delete();
    console.log(file[0].statusCode);
    return file;
  } catch (error) {
    console.log(error);
  }
};

exports.downloadFile = async (name) => {
  const blob = bucket.file('index.ejs');

  const files = await blob.get({});
  return files;
};
