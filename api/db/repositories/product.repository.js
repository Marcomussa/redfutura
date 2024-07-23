const Repository = require('./repository');
const ProductModel = require('../models/product.model');

class ProductRepository extends Repository {
  constructor() {
    super(ProductModel)
  }
}

module.exports = ProductRepository;