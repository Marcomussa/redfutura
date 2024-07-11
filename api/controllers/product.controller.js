const multer = require('multer');
const path = require('path');

const ProductRepository = require('../db/repositories/product.repository');
const ProductService = require('../services/product.service');
const service = new ProductService(ProductRepository);


let Product = {}

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

// MARCO
exports.createProduct = async (req, res) => {
    try {
        const image = req.file ? req.file.filename : null;
        //const newProduct = new Product({});
        //await newProduct.save();
        //res.status(201).json(newProduct);

        if (!req.file) {
            return res.status(400).send('No se ha subido ningún archivo.');
        }

        return res.status(200).send("ok")
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// TEST IONI
exports.createProductTest = async (req, res) => {
    const { body } = req;
    return service.createProduct(body);
};

// MARCO
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Obtener todos los productos de la base de datos
        res.status(200).json(products); // Responder con la lista de productos
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// IONI
exports.getAllProductsTest = async (req, res) => {
    return service.getProducts();
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
    try {
        const productId = req.params.productId;
        const deletedProduct = await Product.findByIdAndDelete(productId); // Eliminar el producto por ID
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.upload = upload;
