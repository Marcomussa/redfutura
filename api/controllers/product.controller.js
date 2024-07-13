const multer = require('multer');
const path = require('path');

const ProductRepository = require('../db/repositories/product.repository');
const ProductService = require('../services/product.service');
const service = new ProductService(ProductRepository);

let Product = {}

exports.createProduct = async (req, res) => {
    const { body, file } = req;
    try {
        const product = await service.createProduct({ ...body, file });
        return res.status(200).json(product);
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await service.getProducts();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { name, description } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { name, price, description },
            { new: true } // Devolver el producto actualizado
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(updatedProduct); // Responder con el producto actualizado
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const productId = req.params.productId;

    try {
        await service.deleteProduct(productId);
        return res.status(200);
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
});

exports.upload = upload;
