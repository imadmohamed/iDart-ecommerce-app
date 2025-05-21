// class APIFeatures {
//   constructor(query, queryString) {
//     this.query = query;
//     this.queryString = queryString;
//   }

//   search() {
//     const keyword = this.queryString.keyword
//       ? {
//           name: {
//             $regex: this.queryString.keyword,
//             $options: "i", 
//           },
//         }
//       : {};

//     this.query = this.query.find({ ...keyword }); 
//     return this;
//   }

 

//   filter() {
//   const queryStrCopy = { ...this.queryString };

//   const removeFields = ["keyword", "page", "limit"];
//   removeFields.forEach(field => delete queryStrCopy[field]);

  
//   let queryString = JSON.stringify(queryStrCopy);
//   queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

//   this.query.find(JSON.parse(queryString));

//   return this;
// }

// }


// module.exports = APIFeatures;


class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };

    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach(field => delete queryObj[field]);

    // Transform query string to MongoDB filter object
    let filters = {};

    Object.keys(queryObj).forEach(key => {
      if (key.includes('[')) {
        const [field, op] = key.split('[');
        const operator = op.replace(']', '');

        if (!filters[field]) filters[field] = {};
        filters[field][`$${operator}`] = Number(queryObj[key]); // cast to number
      } else {
        filters[key] = queryObj[key];
      }
    });

    this.query = this.query.find(filters);
    return this;
  }
  paginate(resPerPage){
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query.limit(resPerPage).skip(skip);
    return this;
    
  }

}

module.exports = APIFeatures;
