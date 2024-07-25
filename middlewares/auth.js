const AUTH_KEY = process.env.AUTH_KEY 

const authenticate = (req, res, next) => {
  const authKey = req.headers['x-auth-key']
    
  if (!authKey || authKey !== AUTH_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  next()
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/admin/productos');
    }
    next();
}

module.exports = { checkAuthenticated, checkNotAuthenticated, authenticate };