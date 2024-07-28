// NOTE: This routes are only for testing purposes. Delete them when connecting Frontend-Backend
const express = require('express');

const { upload } = require('../api/utils/multer');

const ProductRepository = require('../api/db/repositories/product.repository');
const ProductService = require('../api/services/product.service');
const productService = new ProductService(ProductRepository);

const SupplierRepository = require('../api/db/repositories/supplier.repository');
const SupplierService = require('../api/services/supplier.service');
const supplierService = new SupplierService(SupplierRepository);

const MemberRepository = require('../api/db/repositories/member.repository');
const MemberService = require('../api/services/member.service');
const memberService = new MemberService(MemberRepository);

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

const createManyProducts = async (req, res) => {
  const { file } = req;
  try {
    await productService.createManyProducts(file);
    return res.status(200).json({ msg: 'OK' });
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
};
router.post('/products/many', upload.single('products'), createManyProducts);

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
    const suppliers = await supplierService.getSuppliers(req.query?.name);
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


// MEMBERS
const getAllMembers = async (req, res) => {
  try {
    const members = await memberService.getMembers(req.query?.name);
    return res.status(200).json(members);
  } catch (error) {
    return res.status(500).json(error);
  }
};
router.get('/members', getAllMembers);

const createMember = async (req, res) => {
  const { body, file } = req;
  try {
    const member = await memberService.createMember({
      ...body,
      file
    })
    return res.status(200).json(member)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
};
router.post('/members', upload.single('image'), createMember);

const updateMember = async (req, res) => {
  const memberId = req.params.memberId;
  const { body } = req;

  try {
    const response = await memberService.updateMember(memberId, body);
    return res.status(200).json(response)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
};
router.put('/members/:memberId', updateMember);

const updateMemberImage = async (req, res) => {
  const memberId = req.params.memberId;
  const { file } = req;

  try {
    const response = await memberService.updateMemberImage(memberId, file);
    return res.status(200).json(response)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
};
router.put('/members/:memberId/image', upload.single('image'), updateMemberImage);

const deleteMember = async (req, res) => {
  const memberId = req.params.memberId;

  try {
    const response = await memberService.deleteMember(memberId);
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
};
router.delete('/members/:memberId', deleteMember);

module.exports = router;
