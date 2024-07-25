const express = require('express')
const router = express.Router()
const { checkAuthenticated, authenticate } = require('../middlewares/auth')
const productController = require('../controllers/product.controller')
const memberController = require('../controllers/member.controller')
const supplierController = require("../controllers/supplier.controller")

//! AUTH
router.use(checkAuthenticated)

//? GET //
router.get('/', (req, res) => res.render('admin/admin'))
//! Productos
router.get('/productos', productController.getAllProducts)

router.get('/productos/search', productController.findProductByName)

//! Integrantes
router.get('/integrantes', memberController.getAllMembers)

router.get('/integrantes/search', memberController.findMemberByName)

//! Proveedores
router.get('/proveedores', supplierController.getAllSuppliers)

router.get('/proveedores/search', supplierController.findSupplierByName)

//* POST *//
//! Productos
router.post('/productos/create', productController.upload.single('image'), productController.createProduct)

router.post("/productos/delete/:productId", productController.deleteProduct)

router.post("/productos/update/:productId", productController.updateProduct)

router.post("/productos/update-image/:productId", productController.upload.single('image'), productController.updateProductImage)

//! Integrantes
router.post('/integrantes/create', memberController.upload.single('image'), memberController.createMember)

router.post("/integrantes/delete/:memberId", memberController.deleteMember)

router.post("/integrantes/update/:memberId", memberController.updateMember)

router.post("/integrantes/update-image/:memberId", memberController.upload.single('image'), memberController.updateMemberImage)

//! Provedores
router.post('/proveedores/create', supplierController.upload.single('image'), supplierController.createSupplier)

router.post("/proveedores/delete/:supplierId", supplierController.deleteSupplier)

router.post("/proveedores/update/:supplierId", supplierController.updateSupplier)

router.post("/proveedores/update-image/:supplierId", supplierController.upload.single('image'), supplierController.updateSupplierImage)

module.exports = router
