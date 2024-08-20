const multer = require('multer');
const path = require('path');
const ProductRepository = require('../api/db/repositories/product.repository');
const ProductService = require('../api/services/product.service');
const service = new ProductService(ProductRepository);

const SupplierRepository = require('../api/db/repositories/supplier.repository');
const SupplierService = require('../api/services/supplier.service');
const serviceSup = new SupplierService(SupplierRepository);

exports.findProductByName = async (req, res) => {
    const { product } = req.query
    try {
        const result = await service.getProducts(product)
        const suppliers = await serviceSup.getSuppliers()
        return res.render("admin/productos", {
            products: [],
            suppliers,
            result
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

exports.createManyProducts = async (req, res) => {
    const { file } = req
    try {
        await service.createManyProducts({
            file
        })
        return res.status(200).redirect("/admin/productos")
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            error: error.message
        })
    }
}

exports.createProduct = async (req, res) => {
    const { body, file } = req;
    console.log(body)
    try {
        await service.createProduct({
            ...body,
            file
        })
        return res.status(200).redirect("/admin/productos")
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const suppliers = await serviceSup.getSuppliers()
        const products = await service.getProducts()
        res.render("admin/productos", {
            products,
            suppliers
        })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    const productId = req.params.productId
    const { body } = req
    try {
        await service.updateProduct(productId, body);
        return res.status(200).redirect("/admin/productos")
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
};

exports.updateProductImage = async (req, res) => {
    const productId = req.params.productId;
    const { file } = req;

    try {
        await service.updateProductImage(productId, file);
        return res.status(200).redirect("/admin/productos")
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
};

exports.deleteProduct = async (req, res) => {
    const productId = req.params.productId;

    try {
        await service.deleteProduct(productId);
        return res.status(200).redirect("/admin/productos")
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};

// MARCO TEST
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limite de 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten archivos de imagen'));
    }
})

const storageExcel = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Carpeta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

const uploadExcel = multer({
    storage: storageExcel
})

exports.uploadExcel = uploadExcel

exports.upload = upload;
