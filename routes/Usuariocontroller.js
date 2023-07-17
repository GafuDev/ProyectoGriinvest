const express = require('express');
const router = express.Router();

const db = require('../db/database'); //ref a la BD
const { isLoggedIn } = require('../lib/logueado');

router.get('/agregar', (req, res) => {
    res.render('usuario/agregar');
});

router.post('/agregar', isLoggedIn, async (req, res) => {
    console.log(req.body)
    const { nombre, apellido, telefono, correo, contrasena, rol, admin } = req.body;
    const nuevoUsuario = {
        nombre,
        apellido,
        telefono,
        correo,
        contrasena,
        rol,
        admin
    };
    await db.query('INSERT INTO usuarios set ?', [nuevoUsuario]);
    req.flash('Realizado', 'Usuario guardado exitosamente');
    res.redirect('listar'); //corregido
});

/*router.get('/listar', isLoggedIn, async (req, res) => {
    const listUsuario = await db.query('SELECT * FROM usuarios'); //WHERE user_id = ?', [req.user.id]
    res.render('usuario/listar', { listUsuario });
});*/

//LISTAR USUARIO ADMINISTRADOR
router.get('/listar', isLoggedIn, async (req, res) => {
      const usuariosAdm = await db.query('SELECT * FROM usuarios WHERE admin = 3');
      res.render('usuario/listar', { usuariosAdm });
  });


router.get('/eliminar/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM usuarios WHERE ID = ?', [id]);
    req.flash('Realizado', 'Usuario eliminado con éxito');
    res.redirect('/views/listar');
});

router.get('/actualizar/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const actualizarUsuario = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    res.render('usuario/actualizar', { actualizarUsuario: actualizarUsuario[0] });
});

router.post('/actualizar/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, telefono, correo, contrasena, rol } = req.body;
    const nuevoUsuario = {
        nombre,
        apellido,
        telefono,
        correo,
        contrasena,
        rol
    };
    await db.query('UPDATE usuarios set ? WHERE id = ?', [nuevoUsuario, id]);
    req.flash('Realizado', 'Usuario actualizado con éxito');
    res.redirect('/views/listar');
});

//CONTROLADORES DE PROYECTO
router.get('/agregarProy', (req, res) => {
    res.render('proyectos/agregarProy');
});

router.post('/agregarProy', isLoggedIn, async (req, res) => {
    console.log(req.body)
    const { titulo, costo_proyecto, region, rubro,
        apreciacion_general, destacado } = req.body;
    const fecha_publicacion = new Date();
    const estado = null;
    const nuevoProyecto = {
        titulo,
        costo_proyecto,
        region,
        rubro,
        estado,
        fecha_publicacion,
        apreciacion_general,
        destacado,
        user_id: req.user.id
    };
    await db.query('INSERT INTO proyectos set ?', [nuevoProyecto]);
    req.flash('Realizado', 'Proyecto publicado exitosamente');
    res.redirect('listarProy');
});

//Listar TODOS listas EN visitarProyectos
router.get('/listarTodoProy', async (req, res) => {
    const listAllProy = await db.query('SELECT * FROM proyectos'); //WHERE user_id = ?', [req.user.id]
    res.render('visitarProyectos', { listAllProy });
});

//ver cada proyecto UNICO (se ve, pero hay que corregir la lógica)
/*router.get('/verProyecto/:id_proyecto', isLoggedIn, async (req, res) => {
    try {
      const { id_proyecto } = req.params;
      const verProy = await db.query('SELECT * FROM proyectos WHERE id_proyecto = ?', [id_proyecto]);
      res.render('proyectos/verProyecto', { verProy: verProy[0] });
    } catch (error) {
      console.log(error);
    }
  });*/

  //PRUEBA VER PROYECTO ID SACANDO CORREO
  router.get('/verProyecto/:id_proyecto', isLoggedIn, async (req, res) => {
    try {
      const { id_proyecto } = req.params;
      const verProy = await db.query('SELECT * FROM proyectos WHERE id_proyecto = ?', [id_proyecto]);
  
      if (verProy.length > 0) {
        const id = verProy[0].user_id;
        const usuario = await db.query('SELECT correo, nombre, apellido FROM usuarios WHERE id = ?', [id]);
        console.log(usuario);
        if (usuario.length > 0) {
          const proyectoConCorreo = { ...verProy[0], usuario: { correo: usuario[0].correo, nombre: usuario[0].nombre, apellido: usuario[0].apellido } };
          res.render('proyectos/verProyecto', { verProy: proyectoConCorreo });
        } else {
          // Usuario no encontrado
          res.render('proyectos/verProyecto', { verProy: verProy[0] });
        }
      } else {
        // Proyecto no encontrado
        res.render('proyectos/verProyecto', { verProy: null });
      }
    } catch (error) {
      console.log(error);
    }
  });

/*router.get('/verProyecto/:id_proyecto', isLoggedIn, async (req, res) => {
    const { id_proyecto } = req.params;
    const verProy = await db.query('SELECT * FROM proyectos WHERE id_proyecto = ?', [id_proyecto]);
    console.log(verProy)
    res.render('proyectos/verProyecto', { verProy: verProy[0]});
});*/



//Listar proyectos del usuario (funcionando)
router.get('/listarProy', isLoggedIn, async (req, res) => {
    const listProy = await db.query('SELECT * FROM proyectos WHERE user_id = ?', [req.user.id]); //WHERE user_id = ?', [req.user.id]
    res.render('proyectos/listarProy', { listProy });
});

router.get('/eliminarProy/:id_proyecto', isLoggedIn, async (req, res) => {
    const { id_proyecto } = req.params;
    await db.query('DELETE FROM proyectos WHERE id_proyecto = ?', [id_proyecto]);
    req.flash('Realizado', 'Proyecto eliminado con éxito');
    res.redirect('/views/listarProy');
});

router.get('/actualizarProy/:id_proyecto', isLoggedIn, async (req, res) => {
    const { id_proyecto } = req.params;
    const actualizarProyecto = await db.query('SELECT * FROM proyectos WHERE id_proyecto = ?', [id_proyecto]);
    res.render('proyectos/actualizarProy', { actualizarProyecto: actualizarProyecto[0] });
});

router.post('/actualizarProy/:id_proyecto', isLoggedIn, async (req, res) => {
    const { id_proyecto } = req.params;
    const { titulo, region, rubro, apreciacion_general, destacado, costo_proyecto, user_id } = req.body;
    const fecha_publicacion = new Date();
    const estado = null; // cada vez que se actualice deberá ser aprobado
    const nuevoProyecto = {
        titulo,
        region,
        rubro,
        apreciacion_general,
        destacado,
        costo_proyecto,
        estado,
        fecha_publicacion,
        user_id: req.user.id
    };
    await db.query('UPDATE proyectos SET ? WHERE id_proyecto = ?', [nuevoProyecto, id_proyecto]);
    console.log(nuevoProyecto);
    req.flash('Realizado', 'Proyecto actualizado con éxito');
    res.redirect('/views/listarProy');
});



//CONTROLADOR INVERTIR
 

//agregar inversiones
router.get('/invertir', (req, res) => {
    res.render('proyectos/invertir');
});

router.post('/invertir', isLoggedIn, async (req, res) => {
    console.log(req.body)
    const {  } = req.body;
    const fecha = new Date();
    const nuevaInversion = {
        
    };
    await db.query('INSERT INTO inversiones set ?', [nuevaInversion]);
    req.flash('Realizado', 'Inversión registrada exitosamente');
    res.redirect('listarProy');
});


//listar inversion
router.get('/listinvest', isLoggedIn, async (req, res) => {
    const {id_proyecto} = req.params;
    const proyecto = await db.query('SELECT * FROM proyectos WHERE id_proyecto = ?', [req.id_proyecto]);
    const listInver = await db.query('SELECT * FROM inversiones WHERE user_id = ?', [req.user.id]); //WHERE user_id = ?', [req.user.id]
    res.render('proyectos/listinvest', { listInver, proyecto});
});

//-----------------------------------------------------------------------------------------------------


//LISTAR PROYECTOS ADMINISTRADOR PARA APROBAR
router.get('/listarProyAdm', isLoggedIn, async (req, res) => {
    const listProyAdm = await db.query('SELECT * FROM proyectos WHERE estado IS NULL');
    console.log(listProyAdm)
    res.render('proyectos/listarProyAdm', { listProyAdm });
});


//ACTIVAR PROYECTO ADM
router.post('/listarProyAdm/:id_proyecto', isLoggedIn, async (req, res) => {
    const { id_proyecto } = req.params;
  
    const proyectoExistente = await db.query('SELECT * FROM proyectos WHERE id_proyecto = ?', [id_proyecto]);
  
    const { titulo, costo_proyecto, region, rubro, fecha_publicacion,
      apreciacion_general, destacado, user_id } = proyectoExistente[0];
  
    const nuevoProyecto = {
      ...proyectoExistente[0],
      estado: 1 
    };
    console.log(listProyAdm)
    await db.query('UPDATE proyectos SET ? WHERE id_proyecto = ?', [nuevoProyecto, id_proyecto]);
    req.flash('Realizado', 'Proyecto Aprobado exitosamente');
    res.redirect('/views/listarProyAdm');
  });


module.exports = router;