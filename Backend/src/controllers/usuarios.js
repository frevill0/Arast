import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generarToken } from '../middlewares/authController.js';

const prisma = new PrismaClient();


export const crearUsuario = async (req, res) => {
  const { username, nombre, apellido, contrasena, confirmarContrasena, rol } = req.body;

  if (contrasena !== confirmarContrasena) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' });
  }

  try {
    const usuarioExistente = await prisma.usuarios_Arast_Frevill.findUnique({
      where: { username }
    });

    if (usuarioExistente) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    const nombreApellidoExistente = await prisma.usuarios_Arast_Frevill.findFirst({
      where: { nombre, apellido }
    });

    if (nombreApellidoExistente) {
      return res.status(400).json({ message: 'El nombre y apellido ya están en uso' });
    }

    const rolesValidos = ['administrador', 'usuario', 'consultor'];
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

    const saltRounds = 10;
    const contrasenaEncriptada = await bcrypt.hash(contrasena, saltRounds);

    const nuevoUsuario = await prisma.usuarios_Arast_Frevill.create({
      data: {
        username,
        nombre,
        apellido,
        contrasena: contrasenaEncriptada, 
        rol
      }
    });

    res.status(201).json({message : 'El usuario fue registrado exitosamente en la base de datos', nuevoUsuario});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  
export const iniciarSesion = async (req, res) => {
  const { username, contrasena } = req.body;

  if (!username || !contrasena) {
    return res.status(400).json({ error: 'Username y contraseña son requeridos' });
  }

  try {
    const usuario = await prisma.usuarios_Arast_Frevill.findUnique({
      where: { username }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Contraseña Incorrecta' });
    }

    const token = generarToken(usuario.username, usuario.rol);

    // Aquí devolvemos todos los datos del usuario junto con el token
    res.status(200).json({
      message: 'Bienvenido al sistema',
      token,
      usuario // Devuelve todos los datos del usuario
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


  export const obtenerUsuarios = async (req, res) => {
    try {
      const usuarios = await prisma.usuarios_Arast_Frevill.findMany({
        select: { 
          username: true,
          nombre: true,
          apellido: true,
          rol: true
        }
      });
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
export const obtenerUsuarioPorUsername = async (req, res) => {
    const { username } = req.params;
  
    try {
      const usuario = await prisma.usuarios_Arast_Frevill.findUnique({
        where: { username }
      });
  
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
}
};

export const actualizarUsuario = async (req, res) => {
  const { username } = req.params;
  const { nombre, apellido, contrasena, contrasenaConfirmacion, activo, rol } = req.body;

  try {
    const usuarioExistente = await prisma.usuarios_Arast_Frevill.findUnique({
      where: { username }
    });

    if (!usuarioExistente) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const datosActualizacion = {
      nombre: nombre !== undefined ? nombre : usuarioExistente.nombre,
      apellido: apellido !== undefined ? apellido : usuarioExistente.apellido,
      activo: activo !== undefined ? activo : usuarioExistente.activo,
      rol: rol !== undefined ? rol : usuarioExistente.rol,
      fechaModificacion: new Date() 
    };


    if (contrasena) {
      if (contrasena !== contrasenaConfirmacion) {
        return res.status(400).json({ message: 'Las contraseñas no coinciden' });
      }
      const saltRounds = 10;
      datosActualizacion.contrasena = await bcrypt.hash(contrasena, saltRounds);
    }

    const usuarioActualizado = await prisma.usuarios_Arast_Frevill.update({
      where: { username },
      data: datosActualizacion
    });

    res.status(200).json({ msg: "El usuario ha sido actualizado exitosamente", usuarioActualizado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarUsuario = async (req, res) => {
    const { username } = req.params;
  
    try {
      const usuarioExistente = await prisma.usuarios_Arast_Frevill.findUnique({
        where: { username }
      });
  
      if (!usuarioExistente) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      await prisma.usuarios_Arast_Frevill.delete({
        where: { username }
      });
  
      res.status(204).send({msg : "el usuario ha sido eliminado existosamente"}); 
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  export const obtenerUsuarioPorToken = async (req, res) => {
    try {
      // El usuario ya está en req.user gracias al middleware de verificación
      const { username } = req.user; // Extraemos el username del token
  
      // Buscamos al usuario en la base de datos
      const usuario = await prisma.usuarios_Arast_Frevill.findUnique({
        where: { username },
        select: {
          username: true,
          nombre: true,
          apellido: true,
          rol: true,
        }
      });
  
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  