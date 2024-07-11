const SupplierRepository = require('../db/repositories/supplier.repository');
const SupplierService = require('../services/supplier.service');
const service = new SupplierService(SupplierRepository);

exports.createSupplier = async (req, res) => {
  const { body } = req;
  return service.createSupplier(body);
};

exports.getAllSuppliers = async () => { };

exports.getSupplierById = async () => { };