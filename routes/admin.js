const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../middlewares/auth')
const productController = require('../controllers/productController')

router.use(checkAuthenticated)

router.get('/', checkAuthenticated, (req, res) => {
    res.render('admin/admin')
})

router.get('/productos', checkAuthenticated, (req, res) => {
    res.render('admin/productos')
})

router.get('/proveedores', checkAuthenticated, (req, res) => {
    res.render('admin/proveedores')
})

router.get('/integrantes', checkAuthenticated, (req, res) => {
    res.render('admin/integrantes')
})

router.post('/productos/create', productController.createProduct)

module.exports = router
