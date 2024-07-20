const express = require('express')
const router = express.Router()
const memberController = require('../controllers/member.controller')
const MemberRepository = require('../api/db/repositories/member.repository')
const MemberService = require('../api/services/member.service')
const service = new MemberService(MemberRepository)

router.get('/', async (req, res) => {
    const members = await service.getMembers()
    const coords = await memberController.getAllCoords()
    console.log(coords)
    res.render('int-sec')
})



module.exports = router
