class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    /* search product by name using 'keyword' queryparameter 
     for example if we search  /api/v1/products?keyword=oppo only the oppo related 
     string list will be retrived.
     
     in above constructor the query will be out entire prodcut list and
     queryStry will be the query string which we are trying to get.


     */

    search() {
        let keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword, // the keyword will be binded here
                $options: 'i'  // this property is used for case sensitive
            }
        } : {};

        this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryStrCopy = { ...this.queryStr };

        // before query string console
        console.log(queryStrCopy);

        // removing fields from query
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(field => delete queryStrCopy[field]);


        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)/g, match => `$${match}`);
        console.log(queryStr);

        // after query string console
        console.log(queryStrCopy);

        //filter by category
        // this.query.find(queryStrCopy);
        //filter by price
        this.query.find(JSON.parse(queryStr));

        return this;

    }

    paginate(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1)
        this.query.limit(resultPerPage).skip(skip);
        return this;

    }
}

module.exports = APIFeatures;