const express = require('express');
const router = express.Router();

const {
    createProductTest,
    getAllProductsTest
} = require('../api/controllers/product.controller');

router.get('/', (req, res) => {
    res.render('prod-sec');
});

router.post('/test', createProductTest);
router.get('/test', getAllProductsTest);

module.exports = router;
