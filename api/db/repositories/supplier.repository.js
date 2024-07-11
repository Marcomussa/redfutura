const Repository = require('./repository');
const SupplierModel = require('../models/supplier.model');

class SupplierRepository extends Repository {
  constructor() {
    super(SupplierModel)
  }
}

module.exports = SupplierRepository;