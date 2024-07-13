// NOTE: This routes are only for testing purposes. Delete them when connecting Frontend-Backend

const express = require('express');
const router = express.Router();

const { upload } = require('../api/utils/multer');

const {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct
} = require('../api/controllers/product.controller');

// PRODUCTS
router.get('/products', getAllProducts);
router.post('/products', upload.single('image'), createProduct);
router.delete('/products/:productId', deleteProduct);
router.put('/products/:productId', updateProduct);

module.exports = router;
