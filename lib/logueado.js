module.exports = {
    //protege las vistas para poder acceder solo logueado
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) { 
            return next();
        }
        return res.redirect('/login');
    },
    //servirá para que no puedan acceder a una ruta cuando está logueado
    isNotLoggedIn (req, res, next) { 
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/perfil');
    }
};