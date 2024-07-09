const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('prod-sec');
});

module.exports = router;
