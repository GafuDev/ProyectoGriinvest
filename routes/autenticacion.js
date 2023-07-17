const express = require('express');
const router = express.Router();


const passport = require('passport');
const {isLoggedIn, isNotLoggedIn} = require('../lib/logueado');


router.get('/registrarse', (req, res)=>{
    res.render('registro/registrarse')
})

router.post('/registrarse', passport.authenticate('local.signup', {
        successRedirect: '/perfil',
        failureRedirect: '/registrarse',
        failureFlash: true
    })); 

  //INICIO SESION 
  router.get('/login', isNotLoggedIn, (req, res) => { //isLoggedIn
    res.render('registro/login');
  });

  router.post('/login',(req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/perfil',
        failureRedirect: '/login',//cambiar por /login
        failureFlash: true
    })(req, res, next);
  });


    //perfil
    router.get("/perfil", isLoggedIn, (req, res) => { 
      if (req.user === undefined) { 
        res.redirect("/login"); 
      } else 
      res.render("perfil"); });

    //router.get('/perfil', isLoggedIn, (req, res) => { //isLoggedIn redirecciona a inicia sesion si no está logueado
    //  res.render('perfil');
    //});

    //Salir de sesion
    router.get("/salir", isLoggedIn, (req, res, next) => {
      req.logOut(req.user, err => {
          if(err) return next(err);
          res.redirect("/");  
      });
  });


module.exports = router;