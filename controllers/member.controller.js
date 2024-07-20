const multer = require('multer')
const path = require('path')
const axios = require('axios')

const MemberRepository = require('../api/db/repositories/member.repository')
const MemberService = require('../api/services/member.service')
const service = new MemberService(MemberRepository)

exports.getAllMembers = async (req, res) => {
    try {
        const members = await service.getMembers()       
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
    const { body, file } = req

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
}

exports.getAllCoords = async () => {
    try {
        const members = await service.getMembers()       
        const coords = await addressToCoords(members)
        return coords
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

//Pre: [] de Members
//Post: [] de Coords. Cada coords tiene _id asociado a cada address 
async function addressToCoords (members){
    const coords = []
    const geocodeAddress = async (address) => {
        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: address,
                    format: 'json',
                    limit: 1
                }
            })
            if (response.data.length > 0) {
                const location = response.data[0]
                return {
                    lat: location.lat,
                    lon: location.lon
                }
            } else {
                return null
            }
        } catch (error) {
            console.error(`Error: ${address}`, error)
            return null
        }
    }

    for (const member of members) {
        const address = `${member.address}, ${member.city}, ${member.province}, Argentina`
        const location = await geocodeAddress(address)
        if (location) {
            coords.push({
                memberId: member._id,
                name: member.name,
                lat: location.lat,
                lon: location.lon
            })
        }
    }
    return coords
}

async function coordsToAddress (lat, lon){
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
            params: {
                lat: lat,
                lon: lon,
                format: 'json'
            }
        });
        if (response.data && response.data.address) {
            return response.data.display_name;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error in reverse geocoding: ${lat}, ${lon}`, error);
        return null;
    }
}

// MARCO TEST
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limite de 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/
        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        if (mimetype && extname) {
            return cb(null, true)
        }
        cb(new Error('Solo se permiten archivos de imagen'))
    }
})

exports.upload = upload
