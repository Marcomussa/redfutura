const SupplierRepository = require('../db/repositories/supplier.repository');

const TEST_DEFAULT_IMAGE = 'https://multipoint.com.ar/Image/0/750_750-A5.jpg';

class SupplierService {
  constructor() {
    this._repository = new SupplierRepository()
  }

  async getSuppliers(filters) {
    return this._repository.findMany({});
  }

  async createSupplier(supplier) {
    supplier.image = TEST_DEFAULT_IMAGE;
    return this._repository.create(supplier);
  }

  async updateSupplier() {}

  async deleteSupplier() {}
}

module.exports = SupplierService;
