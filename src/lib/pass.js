const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const db = require('../database');
const secandhelp = require('../lib/secandhelp');

passport.use('local.signup', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'contrasena',
    passReqToCallback: true
}, async (req, correo, contrasena, done)=>{
    const {nombre} = req.body;
    const {apellido} = req.body;
    const {rol} = req.body;
    const nuevoRegistro = {
        nombre,
        apellido,
        correo,
        contrasena,
        rol
    };
    nuevoRegistro.contrasena= await secandhelp.encriptacion(contrasena);
    const resultado = await db.query('INSERT INTO usuarios SET ?', nuevoRegistro);
    nuevoRegistro.id = resultado.insertId;
    return done(null, nuevoRegistro);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
  done(null, rows[0]);
});

//INICIAR SESIÓN

passport.use('local.signin', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'contrasena',
    passReqToCallback: true
}, async (req, correo, contrasena, done) =>{
    const rows = await db.query('SELECT * FROM usuarios WHERE correo = ?', correo);
    if (rows.length > 0) {
        const user = rows[0];
        console.log(typeof contrasena);
        console.log(typeof user.contrasena);
        const validPassword = await secandhelp.comparacionPass(contrasena, user.contrasena);
        console.log(validPassword);
    if (validPassword) {
      done(null, user, req.flash('Realizado', 'Bienvenido ' + user.correo)); 
    } else {
      done(null, false, req.flash('message', 'El Correo o la contraseña ingresada es incorrecta.'));
    }
  } else {
    return done(null, false, req.flash('message', 'El correo ingresado no existe.'));
  }

}));