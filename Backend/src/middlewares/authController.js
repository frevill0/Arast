import jwt from 'jsonwebtoken';

export const generarToken = (username, rol) => {
  return jwt.sign(
    { username, rol },
    process.env.JWT_SECRET, 
    { expiresIn: '5h' } 
  );
};