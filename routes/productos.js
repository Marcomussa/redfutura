const express = require('express');
const router = express.Router();

const { createProductTest } = require('../controllers/productController');

router.get('/', (req, res) => {
    res.render('prod-sec');
});

router.post('/', createProductTest);

module.exports = router;
