const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../middlewares/auth')
const productController = require('../controllers/product.controller')

router.use(checkAuthenticated)

router.get('/', checkAuthenticated, (req, res) => {
    res.render('admin/admin')
})

router.get('/productos', checkAuthenticated, productController.getAllProducts)

router.get('/proveedores', checkAuthenticated, (req, res) => {
    res.render('admin/proveedores')
})

router.get('/integrantes', checkAuthenticated, (req, res) => {
    res.render('admin/integrantes')
})

router.get('/productos/search', productController.findProductByName);

router.post('/productos/create', productController.upload.single('image'), productController.createProduct)

router.post("/productos/delete/:productId", productController.deleteProduct)

router.post("/productos/update/:productId", productController.updateProduct)

router.post("/productos/update-image/:productId",  productController.upload.single('image'), productController.updateProductImage)

module.exports = router
