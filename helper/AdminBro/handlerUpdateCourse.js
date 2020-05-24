const { removeFile } = require('./removeFile');
const { convertParamsToArrayItems } = require('../ConvertParamsToArrayItems');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');

const handlerUpdateCourse = async (request, response, data) => {
  const { record } = data;
  if (!record) {
    throw new NotFoundError(
      [
        `Record of given id ("${request.params.recordId}") could not be found`,
      ].join('\n'),
      'Action#handler'
    );
  }
  if (request.method === 'get') {
    return { record: record.toJSON(data.currentAdmin) };
  }
  const records = { params: request.payload };
  const property = { name: 'section' };
  const sections = convertParamsToArrayItems(property, records);
  for (const key in request.payload) {
    if (request.payload.hasOwnProperty(key) && key.match(/^section/)) {
      if (!key.match(/^section.*?video$/m)) {
        delete request.payload[key];
      }
    }
    if (request.payload.hasOwnProperty(key) && key.match(/^createBy/)) {
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
            fd.append(
              `section[${i}][content][${j}][titleVideo]`,
              item.titleVideo
            );
            if (item.duration)
              fd.append(
                `section[${i}][content][${j}][duration]`,
                item.duration
              );
            if (item.link)
              fd.append(`section[${i}][content][${j}][link]`, item.link);
            if (item.isTry) {
              fd.append(`section[${i}][content][${j}][isTry]`, item.isTry);
            }
            delete item.video;
          });
        });
      } else if (key === 'thumnail' && element.path) {
        fd.append(key, fs.createReadStream(element.path));
        rmVideo.push(element.path);
      } else {
        if (!key.match(/^section.*?video$/m)) {
          fd.append(key, element);
        } else {
          fd.append(
            key,
            fs.createReadStream(element.path),
            element.name.replace(' ', '_')
          );
          rmVideo.push(element.path);
        }
      }
    }
  }
  try {
    const response = await axios.put(
      `/api/course/${request.payload['id']}`,
      fd,
      {
        headers: {
          ...fd.getHeaders(),
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMWZkN2QyZWE2NThlMzlhMDkxYTE5MyIsImlhdCI6MTU4OTg3NjI4OSwiZXhwIjoxNTk3NjUyMjg5fQ.BkAxZWG-_aVtEPCRkwvJG4_twF4nkrcJcYroEKnROI8',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        proxy: {
          host: '127.0.0.1',
          port: 5000,
        },
      }
    );
    removeFile(rmVideo);
    return {
      redirectUrl: data.h.recordActionUrl({
        resourceId: data.resource.id(),
        recordId: response.data.data.id,
        actionName: 'show',
      }),
      notice: {
        message: 'Successfully created a new record',
        type: 'success',
      },
      record: record.toJSON(data.currentAdmin),
    };
  } catch (error) {
    console.log(error.response.data);
    removeFile(rmVideo);
    let { errors } = error.response.data.error;
    for (const key in errors) {
      for (const i in errors[key]) {
        if (i !== 'properties') {
          delete errors[key][i];
        } else {
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
};
exports.handlerUpdateCourse = handlerUpdateCourse;
