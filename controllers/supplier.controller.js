const multer = require('multer');
const path = require('path');
const SupplierRepository = require('../api/db/repositories/supplier.repository');
const SupplierService = require('../api/services/supplier.service');
const service = new SupplierService(SupplierRepository);

exports.findSupplierByName = async (req, res) => {
    const { proveedor } = req.query
    try {
        const result = await service.getSuppliers(proveedor)
        return res.render("admin/proveedores", {
            suppliers: [],
            result
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

exports.createSupplier = async (req, res) => {
    const { body, file } = req;
    try {
        await service.createSupplier({
            ...body,
            file
        })
        return res.status(200).redirect("/admin/proveedores")
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
};

exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await service.getSuppliers()
        res.render("admin/proveedores", {
            suppliers
        })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateSupplier = async (req, res) => {
    const supplierId = req.params.supplierId
    const { body } = req

    try {
        await service.updateSupplier(supplierId, body)
        return res.status(200).redirect("/admin/proveedores")
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
};

exports.updateSupplierImage = async (req, res) => {
    const supplierId = req.params.supplierId;
    const { file } = req;

    try {
        await service.updateSupplierImage(supplierId, file);
        return res.status(200).redirect("/admin/proveedores")
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
};

exports.deleteSupplier = async (req, res) => {
    const supplierId = req.params.supplierId;

    try {
        await service.deleteSupplier(supplierId);
        return res.status(200).redirect("/admin/proveedores")
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
