'use strict';

const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const router = require('./routes');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');



const { database } = require('./db/conexion'); //objeto con la conexion y se la entrego a MySQLStore

//inicializaciones
require('./lib/pass');



const express = require('express');
const app = express();
app.set('port', process.env.PORT || 3000);

//handlebars

app.set('views', path.join(__dirname, 'views')); //define la ubicacion de views
app.engine('.hbs', exphbs.engine({ //para que funcione usar engine
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), //indica que layouts está dentro de views
    partialsDir: path.join(app.get('views'), 'partials'), //sirve para agregar el chat
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//MIDDLEWARES
app.use(session({
    secret: 'GabrielFuentes',
    resave: false, //para que no se renueve
    saveUninitialized: false, //para que no se establezca la sesión
    store: new MySQLStore(database) //guarda sesion en la BD, no en la memoria del servidor
}))
app.use(flash());
app.use(morgan( 'dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//passport
app.use(passport.initialize());
app.use(passport.session());


//variables Globales
app.use((req,res, next)=>{
    app.locals.Realizado = req.flash('Realizado');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
})

//RUTAS
app.use(require('./routes'));
app.use(require('./routes/autenticacion'));

app.use('/views',require('./routes/Usuariocontroller', router));
//app.use('/',require('./routes/ListarIndexCtrl', router)); 


//ARCHIVOS PÚBLICOS
app.use(express.static(path.join(__dirname, 'public')));

//INICIO SERVIDOR
app.listen(app.get('port'), () => {
    console.log('Servidor en puerto', app.get('port'));
});

