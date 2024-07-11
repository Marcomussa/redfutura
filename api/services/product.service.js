const ProductRepository = require('../db/repositories/product.repository');

const TEST_DEFAULT_IMAGE = 'https://multipoint.com.ar/Image/0/750_750-A5.jpg';

class ProductService {
  constructor() {
    this._repository = new ProductRepository()
  }

  async getProducts(filters) {
    return this._repository.findMany({});
  }

  async createProduct(product) {
    // TODO: Upload image to Cloudinary
    product.image = TEST_DEFAULT_IMAGE;
    const response = await this._repository.create(product)
    return response;
  }

  async createManyProducts(products) { }

  async updateProduct() { }

  async deleteProduct() { }
}

module.exports = ProductService;
