const mysql = require('mysql');
const {promisify} = require('util');

const { database } = require('./conexion');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'ECONNREFUSED') {
        console.error('Conexión a la BD rechazada...');
      }
      if (err) {
        connection.log('Ha ocurrido un error...' + err);
      }
    }
  
    if (connection) connection.release();
    console.log('Base de Datos conectada correctamente...');
  
    return;
  });
  
 //sirve para cambiar callbacks por promesas. 
  pool.query = promisify(pool.query);
  
  module.exports = pool;