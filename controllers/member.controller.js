const multer = require('multer');
const path = require('path');

const MemberRepository = require('../api/db/repositories/member.repository');
const MemberService = require('../api/services/member.service');
const service = new MemberService(MemberRepository)

exports.getAllMembers = async (req, res) => {
    try {
        const members = await service.getMembers()
        console.log(members)
        res.render('admin/integrantes', {
            members
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

exports.createMember = async (req, res) => {
    const { body, file } = req;
    console.log(req.body)
    console.log(req.file)

    try {
        await service.createMember({
            ...body,
            file
        })
        return res.status(200).redirect("/admin/integrantes")
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
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
