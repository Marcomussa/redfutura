const ProductRepository = require('../db/repositories/product.repository');

const testImage = 'https://multipoint.com.ar/Image/0/750_750-A5.jpg';

class ProductService {
  constructor() { 
    this._repository = new ProductRepository()
  }

  async getProducts(filters) { }

  async createProduct(product) {
    // TODO: Upload image to Cloudinary
    product.image = testImage;
    const response = await this._repository.create(product)
    console.log('RESPONSE: ', response);
  }

  async createManyProducts(products) { }

  async updateProduct() { }

  async deleteProduct() { }
}

module.exports = ProductService;
