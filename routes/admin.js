const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../middlewares/auth');

router.get('/', checkAuthenticated, (req, res) => {
    res.render('admin/admin');
});

router.get('/productos', checkAuthenticated, (req, res) => {
    res.render('admin/productos');
});

router.get('/proveedores', checkAuthenticated, (req, res) => {
    res.render('admin/proveedores');
});

router.get('/integrantes', checkAuthenticated, (req, res) => {
    res.render('admin/integrantes');
});

module.exports = router;
