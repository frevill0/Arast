import express from 'express';
import {
  iniciarSesion,
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorUsername,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarioPorToken,
  cambiarPassword
} from '../controllers/usuarios.js';
import { verificarToken, esAdministrador } from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post('/usuarios/login', iniciarSesion)
router.post('/usuarios/crear', verificarToken, esAdministrador, crearUsuario);
router.get('/usuarios/todos', verificarToken, esAdministrador, obtenerUsuarios);
router.get('/usuarios/:username', verificarToken, esAdministrador, obtenerUsuarioPorUsername);
router.get('/usuario/token', verificarToken, obtenerUsuarioPorToken);
router.put('/usuarios/:username', verificarToken, esAdministrador, actualizarUsuario);
router.delete('/usuarios/:username', verificarToken, esAdministrador, eliminarUsuario);
router.put('/usuarios/cambiar-password/:username', verificarToken, esAdministrador, cambiarPassword);

export default router;
