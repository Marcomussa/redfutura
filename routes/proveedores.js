const express = require('express')
const router = express.Router()
const SupplierRepository = require('../api/db/repositories/supplier.repository');
const SupplierService = require('../api/services/supplier.service');
const service = new SupplierService(SupplierRepository);

router.get('/', async (req, res) => {
    const supplier = await service.getSuppliers()
    res.render('prov-sec', {
        supplier
    })
})

module.exports = router

