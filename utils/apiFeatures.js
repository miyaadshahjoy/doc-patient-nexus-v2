module.exports = class {
  constructor(query, queryObject) {
    this.query = query;
    this.queryObject = queryObject;
  }

  // Filter method
  filter() {
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    const filteredQueryObject = {};

    Object.keys(this.queryObject).forEach((key) => {
      if (!excludedFields.includes(key))
        filteredQueryObject[key] = this.queryObject[key];
    });

    let queryString = JSON.stringify(filteredQueryObject);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`,
    );
    console.log(queryString);
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  // sorting method
  sort() {
    if (this.queryObject.sort) {
      const sortBy = this.queryObject.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }

    return this;
  }

  // select method
  select() {
    if (this.queryObject.fields) {
      const selectBy = this.queryObject.fields.split(',').join(' ');
      this.query = this.query.select(selectBy);
    }

    return this;
  }

  // paginate method
  paginate() {
    if (this.queryObject.page) {
      const page = +this.queryObject.page || 1; // '+' is used to convert the String into Number
      const limit = +this.queryObject.limit || 100;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
};
