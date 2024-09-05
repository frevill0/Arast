import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token inválido' });
  }
};

export const esAdministrador = (req, res, next) => {
  if (req.user.rol !== 'administrador') {
    return res.status(403).json({ message: 'Acceso denegado' });
  }
  next();
};
