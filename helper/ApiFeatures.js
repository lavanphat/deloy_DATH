module.exports = class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1/Lọc theo giá trị là chuỗi
    const queryObj = { ...this.queryString };
    const excludedFeild = ['page', 'sort', 'limit', 'fields'];
    excludedFeild.forEach(el => delete queryObj[el]);

    // 2/ Lọc theo giá trị là số
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // 3/Sắp xếp
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort('-createdAt');
    }
    return this;
  }

  limiFields() {
    // 4/ Chọn key muốn lấy
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query.select(fields);
    } else {
      this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    // 5/ Phân trang
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query.skip(skip).limit(limit);
    return this;
  }
};
