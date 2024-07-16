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

  async getProducts(name) {
    if (name) {
      return this._repository.getProductByName(name);
    }
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
      validateFile(file);

      const { publicId, url } = await this._cloudinaryService.uploadImage(file.path, CLOUDINARY_PRODUCTS_FOLDER, product.name);
      product.image = url;
      product.imageId = publicId

      const response = await this._repository.create(product)
      emptyUploadsDirectory();
      return response;
    } catch (error) {
      if (product.imageId) {
        await this._cloudinaryService.deleteImage(product.imageId);
      }

      emptyUploadsDirectory();
      throw error;
    }
  }

  // TODO
  async createManyProducts(products) { }

  async updateProduct(productId, product) {
    try {
      this.validateProduct(product);

      const updatedProduct = await this._repository.updateById(productId, product, true);
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async updateProductImage(productId, file) {
    try {
      validateFile(file);

      const { publicId, url } = await this._cloudinaryService.uploadImage(file.path, CLOUDINARY_PRODUCTS_FOLDER, productId);

      const updateData = { imageId: publicId, image: url };
      const oldProduct = await this._repository.updateById(productId, updateData);

      const { imageId } = oldProduct;
      await this._cloudinaryService.deleteImage(imageId);

      emptyUploadsDirectory();
    } catch (error) {
      emptyUploadsDirectory();
      throw error;
    }
  }

  async deleteProduct(productId) {
    if (!productId) {
      throw new Error('ProductId must be provided');
    }

    try {
      const deletedProduct = await this._repository.deleteById(productId);

      if (!deletedProduct) {
        throw new Error(`Product with id ${productId} does not exist`);
      }

      await this._cloudinaryService.deleteImage(deletedProduct.imageId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductService;
