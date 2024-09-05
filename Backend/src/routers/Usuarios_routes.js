import express from 'express';
import {
  iniciarSesion,
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorUsername,
  actualizarUsuario,
  eliminarUsuario,
} from '../controllers/usuarios.js';
import { verificarToken, esAdministrador } from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post('/usuarios/login', iniciarSesion)
router.post('/usuarios/crear', verificarToken, esAdministrador, crearUsuario);
router.get('/usuarios/todos', verificarToken, esAdministrador, obtenerUsuarios);
router.get('/usuarios/:username', verificarToken, esAdministrador, obtenerUsuarioPorUsername);
router.put('/usuarios/:username', verificarToken, esAdministrador, actualizarUsuario);
router.delete('/usuarios/:username', verificarToken, esAdministrador, eliminarUsuario);

export default router;
