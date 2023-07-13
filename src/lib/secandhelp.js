const bcrypt = require('bcryptjs');


const secandhelp = {};


secandhelp.encriptacion = async (contrasena)=>{
    const salt = await bcrypt.genSalt(10);//genera el hash de cifrado 
    const hash = await bcrypt.hash(contrasena, salt); //con esto genera el paso 10veces y lo cifra
    return hash;
};

secandhelp.comparacionPass = async (contrasena, passBd)=>{ //comparará la contraseña con la que se almacenó 
        return await bcrypt.compare(contrasena, passBd);
    }


module.exports = secandhelp;