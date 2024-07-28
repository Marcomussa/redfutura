const mongoose = require('mongoose');

const Repository = require('./repository');
const SupplierModel = require('../models/supplier.model');
const ProductRepository = require('./product.repository');

class SupplierRepository extends Repository {
  constructor() {
    super(SupplierModel)
    this._productRepository = new ProductRepository()
  }

  async deleteSupplierAndRelatedProducts(supplierId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const supplier = await SupplierModel.findByIdAndDelete(supplierId, { session });

      if (!supplier) {
        throw new Error(`Supplier with id ${supplierId} does not exist`);
      }

      await this._productRepository.deleteMany({ supplier: supplierId });

      await session.commitTransaction();
      session.endSession();
      return supplier;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async findSupplierByName(name) {
    return SupplierModel.findOne({ name });
  }
}

module.exports = SupplierRepository;