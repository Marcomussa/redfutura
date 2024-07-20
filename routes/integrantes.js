const express = require('express')
const router = express.Router()
const memberController = require('../controllers/member.controller')
const MemberRepository = require('../api/db/repositories/member.repository')
const MemberService = require('../api/services/member.service')
const service = new MemberService(MemberRepository)

router.get('/', async (req, res) => {
    const members = await service.getMembers()
    res.render('int-sec')
})

router.get("/get-coords", async (req, res) => {
    const coords = await memberController.getAllCoords()
    res.json(coords)
})

module.exports = router
