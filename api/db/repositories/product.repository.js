const Repository = require('./repository');
const ProductModel = require('../models/product.model');

class ProductRepository extends Repository {
  constructor() {
    super(ProductModel)
  }

  async getProductByName(name) {
    return this.BaseModel.aggregate([{ $match: { $text: { $search: name } } }]);
  }
}

module.exports = ProductRepository;