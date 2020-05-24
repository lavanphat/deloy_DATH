const { removeFile } = require("./removeFile");
const { convertParamsToArrayItems } = require('../ConvertParamsToArrayItems');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const handlerNewCourse = async (request, response, context) => {
  const record = { params: request.payload };
  const property = { name: 'section' };
  const sections = convertParamsToArrayItems(property, record);
  for (const key in request.payload) {
    if (request.payload.hasOwnProperty(key) && key.match(/^section/)) {
      delete request.payload[key];
    }
  }
  request.payload['section'] = sections;
  let fd = new FormData();
  let rmVideo = [];
  for (const key in request.payload) {
    if (request.payload.hasOwnProperty(key)) {
      const element = request.payload[key];
      if (Array.isArray(element)) {
        element.forEach(({ title, content }, i) => {
          fd.append(`section[${i}][title]`, title);
          content.forEach((item, j) => {
            fd.append(`section[${i}][content][${j}][titleVideo]`, item.titleVideo);
            fd.append(`video${i}`, fs.createReadStream(item.video.path));
            rmVideo.push(item.video.path);
            if (item.isTry) {
              fd.append(`section[${i}][content][${j}][isTry]`, item.isTry);
            }
          });
        });
      }
      else {
        if (key === 'thumnail') {
          fd.append(key, fs.createReadStream(element.path));
          rmVideo.push(element.path);
        }
        else {
          fd.append(key, element);
        }
      }
    }
  }
  if (request.method === 'post') {
    try {
      const response = await axios.post('/api/course', fd, {
        headers: {
          ...fd.getHeaders(),
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMWZkN2QyZWE2NThlMzlhMDkxYTE5MyIsImlhdCI6MTU4MTY4NTY5OSwiZXhwIjoxNTg5NDYxNjk5fQ.oFTo0ZfvfBJPjXes7vXh0KXcHWZav76xj1fZwuo-5uE',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        proxy: {
          host: '127.0.0.1',
          port: 5000,
        },
      });
      removeFile(rmVideo);
      return {
        redirectUrl: context.h.recordActionUrl({
          resourceId: context.resource.id(),
          recordId: response.data.data.id,
          actionName: 'show',
        }),
        notice: {
          message: 'Successfully created a new record',
          type: 'success',
        },
      };
    }
    catch (error) {
      console.log(error.response.data);
      removeFile(rmVideo);
      let { errors } = error.response.data.error;
      for (const key in errors) {
        for (const i in errors[key]) {
          if (i !== 'properties') {
            delete errors[key][i];
          }
          else {
            errors[key]['message'] = errors[key]['properties']['message'];
            errors[key]['type'] = errors[key]['properties']['type'];
            delete errors[key]['properties'];
          }
        }
      }
      return {
        record: { errors },
        notice: {
          message: 'There are validation errors - check them out below.',
          type: 'error',
        },
      };
    }
  }
};
exports.handlerNewCourse = handlerNewCourse;
