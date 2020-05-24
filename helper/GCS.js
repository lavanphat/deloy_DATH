const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
  keyFilename: path.join(__dirname, '../config/My Project-347780297f58.json'),
  projectId: 'aerobic-forge-140010'
});

exports.storage = storage;