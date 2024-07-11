const express = require('express');
const router = express.Router();

const {
    createSupplier,
    getAllSuppliers,
    getSupplierById
} = require('../api/controllers/supplier.controller');

router.get('/', (req, res) => {
    res.render('prov-sec');
});

router.post('/test', createSupplier);
router.get('/test', getAllSuppliers);

module.exports = router;
