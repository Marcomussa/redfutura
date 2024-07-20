const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../middlewares/auth')
const productController = require('../controllers/product.controller')
const memberController = require('../controllers/member.controller')

//! AUTH
router.use(checkAuthenticated)

//? GET //
router.get('/', checkAuthenticated, (req, res) => res.render('admin/admin'))
// Productos
router.get('/productos', checkAuthenticated, productController.getAllProducts)

router.get('/productos/search', productController.findProductByName)

// Integrantes
router.get('/integrantes', checkAuthenticated, memberController.getAllMembers)

// Proveedores
router.get('/proveedores', checkAuthenticated, (req, res) => res.render('admin/proveedores'))

//* POST *//
// Productos
router.post('/productos/create', productController.upload.single('image'), productController.createProduct)

router.post("/productos/delete/:productId", productController.deleteProduct)

router.post("/productos/update/:productId", productController.updateProduct)

router.post("/productos/update-image/:productId",  productController.upload.single('image'), productController.updateProductImage)

// Integrantes
router.post('/integrantes/create', memberController.upload.single('image'), memberController.createMember)

router.post("/integrantes/update/:memberId", memberController.updateMember)

router.post("/integrantes/update-image/:memberId", memberController.upload.single('image'), memberController.updateMemberImage)

router.post("/integrantes/delete/:memberId", memberController.deleteMember)
// Provedores

module.exports = router
