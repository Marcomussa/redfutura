const ProductRepository = require('../db/repositories/product.repository');
const CloudinaryService = require('./cloudinary.service');

const { validateFile } = require('../utils/multer');
const emptyUploadsDirectory = require('../utils/emptyUploadsDirectory');

const TEST_DEFAULT_IMAGE = 'https://multipoint.com.ar/Image/0/750_750-A5.jpg';
const CLOUDINARY_PRODUCTS_FOLDER = 'products';

class ProductService {
  constructor() {
    this._repository = new ProductRepository()
    this._cloudinaryService = new CloudinaryService()
  }

  async getProducts(filters) {
    // TODO: Filtering, sorting, pagination, limit
    return this._repository.findMany({});
  }

  validateProduct(product) {
    const {
      name,
      category,
      brand,
      article,
      model,
      sku,
      eanCode,
      cost,
      price,
      supplier
    } = product;

    if (
      !name ||
      !category ||
      !brand ||
      !article ||
      !model ||
      !sku ||
      !eanCode ||
      !cost ||
      !price ||
      !supplier
    ) {
      throw new Error('Please complete all fields')
    }
  }

  async createProduct(product) {
    const { file } = product;

    try {
      this.validateProduct(product);
    } catch (error) {
      emptyUploadsDirectory();
      throw error;
    }

    try {
      validateFile(file);
    } catch (error) {
      emptyUploadsDirectory();
      throw error;
    }

    try {
      const { publicId, url } = await this._cloudinaryService.uploadImage(file.path, CLOUDINARY_PRODUCTS_FOLDER, product.name);
      product.image = url;
      product.imageId = publicId
    } catch (error) {
      emptyUploadsDirectory();
      throw error;
    }

    let response;
    try {
      response = await this._repository.create(product)
    } catch (error) {
      // TODO
      await this._cloudinaryService.deleteImage();

      emptyUploadsDirectory();
      throw error;
    }

    emptyUploadsDirectory();
    return response;
  }

  // TODO
  async createManyProducts(products) { }

  async updateProduct(productId, product) {
    this.validateProduct(product);

    const oldProduct = await this._repository.findById(productId);
    const { image, imageId } = oldProduct;

    product._id = productId;
    product.image = image;
    product.imageId = imageId;

    return this._repository.updateById(product);
  }

  async deleteProduct(productId) {
    if (!productId) {
      throw new Error('ProductId must be provided');
    }

    const { imageId } = await this._repository.findById(productId);

    await this._repository.deleteById(productId);
    await this._cloudinaryService.deleteImage(imageId);
  }
}

module.exports = ProductService;
