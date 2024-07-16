// NOTE: This routes are only for testing purposes. Delete them when connecting Frontend-Backend
const express = require('express');

const { upload } = require('../api/utils/multer');

const ProductRepository = require('../api/db/repositories/product.repository');
const ProductService = require('../api/services/product.service');
const productService = new ProductService(ProductRepository);

const SupplierRepository = require('../api/db/repositories/supplier.repository');
const SupplierService = require('../api/services/supplier.service');
const supplierService = new SupplierService(SupplierRepository);

const router = express.Router();

// PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getProducts(req.query?.name);
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json(error);
  }
};
router.get('/products', getAllProducts);

const createProduct = async (req, res) => {
  const { body, file } = req;
  try {
    const product = await productService.createProduct({
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
    const response = await productService.updateProduct(productId, body);
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
    const response = await productService.updateProductImage(productId, file);
    return res.status(200).json(response)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
};
router.put('/products/:productId/image', upload.single('image'), updateProductImage);

const deleteProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    const response = await productService.deleteProduct(productId);
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
};
router.delete('/products/:productId', deleteProduct);


// SUPPLIERS
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierService.getSuppliers();
    return res.status(200).json(suppliers);
  } catch (error) {
    return res.status(500).json(error);
  }
};
router.get('/suppliers', getAllSuppliers);

const createSupplier = async (req, res) => {
  const { body, file } = req;
  try {
    const supplier = await supplierService.createSupplier({
      ...body,
      file
    })
    return res.status(200).json(supplier)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
};
router.post('/suppliers', upload.single('image'), createSupplier);

const updateSupplier = async (req, res) => {
  const supplierId = req.params.supplierId;
  const { body } = req;

  try {
    const response = await supplierService.updateSupplier(supplierId, body);
    return res.status(200).json(response)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
};
router.put('/suppliers/:supplierId', updateSupplier);

const updateSupplierImage = async (req, res) => {
  const supplierId = req.params.supplierId;
  const { file } = req;

  try {
    const response = await supplierService.updateSupplierImage(supplierId, file);
    return res.status(200).json(response)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
};
router.put('/suppliers/:supplierId/image', upload.single('image'), updateSupplierImage);

const deleteSupplier = async (req, res) => {
  const supplierId = req.params.supplierId;

  try {
    const response = await supplierService.deleteSupplier(supplierId);
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
};
router.delete('/suppliers/:supplierId', deleteSupplier);

module.exports = router;
