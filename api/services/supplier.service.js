const SupplierRepository = require('../db/repositories/supplier.repository');
const CloudinaryService = require('./cloudinary.service');

const { validateFile } = require('../utils/multer');
const emptyUploadsDirectory = require('../utils/emptyUploadsDirectory');

const TEST_DEFAULT_IMAGE = 'https://multipoint.com.ar/Image/0/750_750-A5.jpg';
const CLOUDINARY_SUPPLIERS_FOLDER = 'suppliers';

class SupplierService {
  constructor() {
    this._repository = new SupplierRepository()
    this._cloudinaryService = new CloudinaryService()
  }

  async getSuppliers() {
    return this._repository.findMany({});
  }

  validateSupplier(supplier) {
    const { name } = supplier;

    if (!name) {
      throw new Error('Please complete all fields')
    }
  }

  async createSupplier(supplier) {
    const { file } = supplier;

    try {
      this.validateSupplier(supplier);
      validateFile(file);

      const { publicId, url } = await this._cloudinaryService.uploadImage(file.path, CLOUDINARY_SUPPLIERS_FOLDER, supplier.name);
      supplier.image = url;
      supplier.imageId = publicId

      const response = await this._repository.create(supplier)
      emptyUploadsDirectory();
      return response;
    } catch (error) {
      if (supplier.imageId) {
        await this._cloudinaryService.deleteImage(supplier.imageId);
      }

      emptyUploadsDirectory();
      throw error;
    }
  }

  async updateSupplier(supplierId, supplier) {
    try {
      this.validateSupplier(supplier);

      const updatedSupplier = await this._repository.updateById(supplierId, supplier, true);
      return updatedSupplier;
    } catch (error) {
      throw error;
    }
  }

  async updateSupplierImage(supplierId, file) {
    try {
      validateFile(file);

      const { publicId, url } = await this._cloudinaryService.uploadImage(file.path, CLOUDINARY_SUPPLIERS_FOLDER, supplierId);

      const updateData = { imageId: publicId, image: url };
      const oldSupplier = await this._repository.updateById(supplierId, updateData);

      const { imageId } = oldSupplier;
      await this._cloudinaryService.deleteImage(imageId);

      emptyUploadsDirectory();
    } catch (error) {
      emptyUploadsDirectory();
      throw error;
    }
  }

  async deleteSupplier(supplierId) {
    if (!supplierId) {
      throw new Error('Supplier id must be provided');
    }

    try {
      const deletedSupplier = await this._repository.deleteById(supplierId);

      if (!deletedSupplier) {
        throw new Error(`Supplier with id ${supplierId} does not exist`);
      }

      await this._cloudinaryService.deleteImage(deletedSupplier.imageId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SupplierService;
