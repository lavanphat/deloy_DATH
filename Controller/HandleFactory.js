const tryCatch = require('../helper/TryCatch');
const AppError = require('../helper/AppError');
const APIFeatures = require('../helper/ApiFeatures');

const removeVideoNoTry = (doc, Model) => {
  const Course = require('../model/course');
  if (Model === Course) {
    if (doc.length > 0) {
      doc.forEach((item) => {
        item['section'].forEach((item) =>
          item['content'].forEach((item) => {
            if (!item.isTry) item['link'] = '';
          })
        );
      });
    } else {
      doc['section'].forEach((item) =>
        item['content'].forEach((item) => {
          if (!item.isTry) item['link'] = '';
        })
      );
    }
  }
};

exports.deleteOne = (Model, createBy) =>
  tryCatch(async (req, res, next) => {
    let doc = null;
    if (createBy && req.user.role !== 'Admin') {
      doc = await Model.findOneAndRemove({
        _id: req.params.id,
        [createBy]: req.user.id,
      });
    } else {
      doc = await Model.findOneAndRemove({
        _id: req.params.id,
      });
    }

    if (!doc) {
      return next(new AppError('Không tìm thấy tài liệu', 404));
    }

    res.status(201).json({
      status: 'success',
      data: 'Đã xóa thành công',
    });
  });

exports.updateOne = (Model, createBy, popOptions = null) =>
  tryCatch(async (req, res, next) => {
    let doc = null;
    let msg = '';
    if (createBy) {
      doc = await Model.findOneAndUpdate(
        { _id: req.params.id, [createBy]: req.user.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).populate(popOptions && popOptions);
      msg = 'Bạn ko phải người tạo khóa học này';
    } else {
      doc = await Model.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      }).populate(popOptions && popOptions);
      msg = 'Không tìm thấy tài liệu';
    }

    if (!doc) {
      return next(new AppError(msg, 404));
    }

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

exports.getOne = (Model, popOptions) =>
  tryCatch(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    // removeVideoNoTry(doc, Model);

    if (!doc) {
      return next(new AppError('Không tìm thấy tài liệu', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

// Không có req.pram.id

exports.createOne = (Model) =>
  tryCatch(async (req, res) => {
    let doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

module.exports.getAll = (Model, popOptions) =>
  tryCatch(async (req, res) => {
    let filter = {};
    if (req.params.courseId) filter = { course: req.params.courseId };

    let query = Model.find(filter);
    if (popOptions) query = query.populate(popOptions);

    const features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limiFields()
      .pagination();
    let doc = await features.query;
    // removeVideoNoTry(doc, Model);

    res.status(200).json({
      status: 'success',
      length: doc.length,
      data: doc,
    });
  });

module.exports.hideOne = (Model, createBy) =>
  tryCatch(async (req, res) => {
    let doc = null;
    if (createBy) {
      doc = await Model.findOneAndUpdate(
        { _id: req.params.id, [createBy]: req.user.id },
        { status: false },
        {
          new: true,
          runValidators: true,
        }
      );
    } else {
      doc = await Model.findByIdAndUpdate(
        req.params.id,
        { status: false },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    if (!doc) {
      return next(new AppError('Không tìm thấy khóa học', 404));
    }

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });
