const express = require('express')
const router = express.Router()
const ProductRepository = require('../api/db/repositories/product.repository');
const ProductService = require('../api/services/product.service');
const service = new ProductService(ProductRepository);


router.get('/', async (req, res) => {
    const products = await service.getProducts()
    console.log(products)
    res.render('prod-sec', {
        products
    })
})

module.exports = router

