import Usuario from "../models/Usuario.js"
import generarId from "../helpers/generarId.js"
import generarJWT from "../helpers/generarJWT.js"
import {emailRegistro,emailOlvidePassword} from "../helpers/email.js"

const registrar = async (req,res) => {
    // Evitar registros duplicados
    const { email } = req.body
    const existeUsuario = await Usuario.findOne({email})
    if(existeUsuario){
        const error = new Error("Usuario ya registrado")
        return res.status(400).json({msg: error.message})
    }
    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId();
        await usuario.save()
        //Enviar email de confirmacion
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        res.json({
            msg: "Usuario Creado Correctamente, Revisa tu Email para confirmar tu cuenta"
        })
    } catch (error) {
        console.log(error.response.data.msg)
    }       
}

const autenticar = async(req,res) => {
    const {email, password} = req.body
    // Comprobar que el usuario existe
    const usuario = await Usuario.findOne({email})
    if(!usuario){
      const error = new Error('El usuario no existe');
      return res.status(404).json({msg: error.message});
    }
    // Comprobar si el usuario esta confirmado
    if(!usuario.confirmado) {
        const error = new Error("Tu Cuenta no ha sido confirmado");
        return res.status(403).json({ msg: error.message })
    }
    // Comprobar su password
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email:usuario.email,
            token:generarJWT(usuario._id)
        })
        console.log('es correcto')
    } else {
        console.log('es incorrecto')
        const error = new Error("El password es incorrecto");
        return res.status(403).json({ msg: error.message })
    }
}

const confirmar = async (req,res) => {
    const { token } = req.params
    const usuarioConfirmar = await Usuario.findOne({ token })
    if(!usuarioConfirmar){
        const error = new Error("Token no válido")
        return res.status(403).json({ msg: error.message })
    }
    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = ""; // se pone en blanco el valor del token ya que es de un solo uso
        await usuarioConfirmar.save(); // se graba los cambios en el usuario 
        res.json({ msg: "Usuario Confirmado Correctamente" });
    } catch(error){
        console.log(error)
    }
}

const olvidePassword = async (req,res) => {
    const { email } = req.body;
    //verificar que el usuario existe
    const usuario = await Usuario.findOne({email});
    if(!usuario) {
      const error = new Error('El usuario no existe');
      return res.status(404).json({ msg: error.message });
    }
    try {
        usuario.token = generarId();
        await usuario.save()
        // enviar el email con las instrucciones
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        res.json({ msg: "Hemos enviado un email con las instrucciones"})
    } catch(error) {
      console.log(error)
    }
}

const comprobarToken = async (req,res) => {
    const { token } = req.params
    const tokenValido = await Usuario.findOne({ token })
    if(tokenValido){
        res.json({ msg: "Token válido y el Usuario existe"})
    } else {
      const error = new Error('Token no válido');
      return res.status(404).json({ msg: error.message });
    }
}

const nuevoPassword = async (req,res) => {
    const { token } = req.params
    const { password } = req.body
    const usuario = await Usuario.findOne({ token })
    if(usuario) {
      usuario.password = password;
      usuario.token = "";
      try {
         await usuario.save()
         res.json({ msg: "Password modificado correctamente"})
      } catch (error) {
         console.log(error)
      }
    } else {
      const error = new Error('Token no válido');
      return res.status(404).json({ msg: error.message });
    }
}

const perfil = async (req,res) => {
    const { usuario } = req
    res.json(usuario)
}

export { registrar,autenticar,confirmar,olvidePassword,comprobarToken,nuevoPassword,perfil }

