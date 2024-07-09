const express = require('express');
const router = express.Router();
const passport = require('passport');
const { checkNotAuthenticated } = require('../middlewares/auth');

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login');
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/admin/productos',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

router.delete('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) { return next(err); }
        res.redirect('/auth/login');
    });
});

module.exports = router;
