const Repository = require('./repository');
const ProductModel = require('../models/product.model');

class ProductRepository extends Repository {
  constructor() {
    super(ProductModel)
  }

  async deleteMany(filter) {
    await ProductModel.deleteMany(filter);
  }

  async createMany(products) {
    await ProductModel.create(products);
  }
}

module.exports = ProductRepository;