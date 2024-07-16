// NOTE: This routes are only for testing purposes. Delete them when connecting Frontend-Backend
const express = require('express');

const { upload } = require('../api/utils/multer');
const ProductRepository = require('../api/db/repositories/product.repository');
const ProductService = require('../api/services/product.service');
const service = new ProductService(ProductRepository);

const router = express.Router();

// PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const products = await service.getProducts(req.query?.name);
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json(error);
  }
};
router.get('/products', getAllProducts);

const createProduct = async (req, res) => {
  const { body, file } = req;
  try {
    const product = await service.createProduct({
      ...body,
      file
    })
    return res.status(200).json(product)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
};
router.post('/products', upload.single('image'), createProduct);

const updateProduct = async (req, res) => {
  const productId = req.params.productId;
  const { body } = req;

  try {
    const response = await service.updateProduct(productId, body);
    return res.status(200).json(response)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
};
router.put('/products/:productId', updateProduct);

const updateProductImage = async (req, res) => {
  const productId = req.params.productId;
  const { file } = req;

  try {
    const response = await service.updateProductImage(productId, file);
    return res.status(200).json(response)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
};
router.put('/products/:productId/image', upload.single('image'), updateProductImage);

const deleteProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    const response = await service.deleteProduct(productId);
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
};
router.delete('/products/:productId', deleteProduct);

module.exports = router;
