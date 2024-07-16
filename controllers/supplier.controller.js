const SupplierRepository = require('../api/db/repositories/supplier.repository');
const SupplierService = require('../api/services/supplier.service');
const service = new SupplierService(SupplierRepository);

