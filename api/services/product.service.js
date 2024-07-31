const xlsx = require('xlsx');
const path = require("path")

const ProductRepository = require('../db/repositories/product.repository');
const SupplierRepository = require('../db/repositories/supplier.repository');
const CloudinaryService = require('./cloudinary.service');

const { validateFile } = require('../utils/multer');
const emptyUploadsDirectory = require('../utils/emptyUploadsDirectory');

const CLOUDINARY_PRODUCTS_FOLDER = 'products';
const NO_IMAGE_URL = 'https://res.cloudinary.com/dw6ri09rd/image/upload/v1722170457/products/no_image_qxtmba.jpg';
const NO_IMAGE_ID = 'no_image_qxtmba';

class ProductService {
  constructor() {
    this._repository = new ProductRepository()
    this._supplierRepository = new SupplierRepository()
    this._cloudinaryService = new CloudinaryService()
  }

  async getProducts(name) {
    if (name) {
      return this._repository.findByName(name);
    }
    return this._repository.findMany({}, { populate: 'supplier' });
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
      supplier,
      section
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
      !supplier ||
      !section
    ) {
      throw new Error('Please complete all fields')
    }

    if (typeof Number(cost) != 'number' || typeof Number(price) != 'number') {
      throw new Error('Cost and Price must be in number format')
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

  async parseWorkbookToProduct(products) {
    const parsedProducts = [];

    for (const product of products) {
      const {
        nombre,
        categoria,
        marca,
        articulo,
        modelo,
        sku,
        ean,
        descripcion,
        costo,
        precio,
        proveedor,
        seccion
      } = product;

      const supplier = await this._supplierRepository.findSupplierByName(proveedor);
      if (!supplier) {
        throw new Error(`No supplier with name ${proveedor}`);
      }

      const parsedProduct = {
        name: nombre,
        category: categoria,
        brand: marca,
        article: articulo,
        model: modelo,
        sku,
        eanCode: ean,
        description: descripcion,
        cost: costo,
        price: precio,
        supplier: supplier._id,
        section: seccion,
        image: NO_IMAGE_URL,
        imageId: NO_IMAGE_ID
      };
      parsedProducts.push(parsedProduct);
    }

    return parsedProducts;
  }

  async validateWorkbook(file) {
    const { Sheets: sheets } = file
    const sheetsNames = Object.keys(sheets);
    if (sheetsNames.length != 1) {
      throw new Error('File must have exactly one sheet');
    }


    const sheet = sheetsNames[0];
    const sheetProducts = xlsx.utils.sheet_to_json(sheets[sheet]);
    const products = await this.parseWorkbookToProduct(sheetProducts);

    products.forEach((prod) => {
      this.validateProduct(prod);
    });

    return products;
  }

  async createManyProducts(file) {
    const excel = file.file 
    const filePath = path.join(__dirname, '../../', excel.path)
    const workbook = xlsx.readFile(filePath)

    try {
      const products = await this.validateWorkbook(workbook);
      await this._repository.createMany(products);
      emptyUploadsDirectory();
    } catch (error) {
      emptyUploadsDirectory();
      throw error;
    }
  }

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
      if (imageId != NO_IMAGE_ID) {
        await this._cloudinaryService.deleteImage(imageId);
      }

      emptyUploadsDirectory();
    } catch (error) {
      emptyUploadsDirectory();
      throw error;
    }
  }

  async deleteProduct(productId) {
    if (!productId) {
      throw new Error('Product id must be provided');
    }

    try {
      const deletedProduct = await this._repository.deleteById(productId);

      if (!deletedProduct) {
        throw new Error(`Product with id ${productId} does not exist`);
      }

      if (deletedProduct.imageId != imageId) {
        await this._cloudinaryService.deleteImage(deletedProduct.imageId);
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductService;
