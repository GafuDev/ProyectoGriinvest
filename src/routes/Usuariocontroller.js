const express = require('express');
const router = express.Router();

const db = require('../database'); //ref a la BD
const {isLoggedIn} = require('../lib/logueado');

router.get('/agregar', (req, res) => {
    res.render('usuario/agregar');
});

router.post('/agregar', isLoggedIn, async (req, res) => {
    console.log(req.body)
    const { nombre, apellido, correo, contrasena, rol} = req.body;
    const nuevoUsuario = {
        nombre, 
        apellido, 
        correo, 
        contrasena, 
        rol     
    };
    await db.query('INSERT INTO usuarios set ?', [nuevoUsuario]);
    req.flash('Realizado', 'Usuario guardado exitosamente');
    res.redirect('listar'); //corregido
});

router.get('/listar', isLoggedIn, async (req, res) => {
    const listUsuario = await db.query('SELECT * FROM usuarios'); //WHERE user_id = ?', [req.user.id]
    res.render('usuario/listar', { listUsuario });
});

router.get('/eliminar/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM usuarios WHERE ID = ?', [id]);
    req.flash('Realizado', 'Usuario eliminado con éxito');
    res.redirect('/griinvest/listar');
});

router.get('/actualizar/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const actualizarUsuario = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    res.render('usuario/actualizar', {actualizarUsuario: actualizarUsuario[0]});
});

router.post('/actualizar/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correo, contrasena, rol} = req.body; 
    const nuevoUsuario = {
        nombre, 
        apellido, 
        correo, 
        contrasena, 
        rol
    };
    await db.query('UPDATE usuarios set ? WHERE id = ?', [nuevoUsuario, id]);
    req.flash('Realizado', 'Usuario actualizado con éxito');
    res.redirect('/griinvest/listar');
});

//CONTROLADORES DE PROYECTO
router.get('/agregarProy', (req, res) => {
    res.render('proyectos/agregarProy');
});

router.post('/agregarProy', isLoggedIn, async (req, res) => {
    console.log(req.body)
    const { titulo, descripcion, costo_proyecto, imagen, region, rubro, 
          apreciacion_general, destacado, beneficio} = req.body;
    const fecha_publicacion = new Date();
    const estado = true;
    const nuevoProyecto = {
        titulo, 
        descripcion, 
        costo_proyecto, 
        imagen, 
        region, 
        rubro, 
        estado, 
        fecha_publicacion, 
        apreciacion_general, 
        destacado, 
        beneficio,
        user_id: req.user.id
    };
    await db.query('INSERT INTO proyectos set ?', [nuevoProyecto]);
    req.flash('Realizado', 'Proyecto publicado exitosamente');
    res.redirect('listarProy'); 
});

router.get('/listarProy', isLoggedIn, async (req, res) => {
    const listProy = await db.query('SELECT * FROM proyectos'); //WHERE user_id = ?', [req.user.id]
    res.render('proyectos/listarProy', { listProy });
});

router.get('/eliminarProy/:id_proyecto', isLoggedIn, async (req, res) => {
    const { id_proyecto } = req.params;
    await db.query('DELETE FROM proyectos WHERE id_proyecto = ?', [id_proyecto]);
    req.flash('Realizado', 'Proyecto eliminado con éxito');
    res.redirect('/griinvest/listarProy');
});

router.get('/actualizarProy/:id_proyecto', isLoggedIn, async (req, res) => {
    const { id_proyecto } = req.params;
    const actualizarProyecto = await db.query('SELECT * FROM proyectos WHERE id_proyecto = ?', [id_proyecto]);
    res.render('/griinvest/actualizarProy', {actualizarProyecto: actualizarProyecto[0]});
});

router.post('/actualizarProy/:id_proyecto', isLoggedIn, async (req, res) => {
    const { id_proyecto } = req.params;
    const { titulo, descripcion, costo_proyecto, imagen, region, rubro, 
        apreciacion_general, destacado, beneficio} = req.body;
    const fecha_publicacion = new Date();
    const estado = true; 
    const nuevoProyecto = {
        titulo, 
        descripcion, 
        costo_proyecto, 
        imagen, 
        region, 
        rubro, 
        estado, 
        fecha_publicacion, 
        apreciacion_general, 
        destacado, 
        beneficio,
        user_id: req.user.id
    };
    await db.query('UPDATE proyectos set ? WHERE id_proyecto = ?', [nuevoProyecto, id_proyecto]);
    req.flash('Realizado', 'Proyecto actualizado con éxito');
    res.redirect('griinvest/listarProy');
});
module.exports = router;