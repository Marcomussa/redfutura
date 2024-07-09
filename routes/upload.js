const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const uploadController = require('../controllers/uploadController')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Carpeta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

const upload = multer({ 
    storage: storage 
})

router.post('/productos', upload.single('file'), uploadController.handleUploadProductos)

router.post('/proveedores', upload.single('file'), uploadController.handleUploadProveedores)

router.post('/integrantes', upload.single('file'), uploadController.handleUploadIntegrantes)

module.exports = router
