import React from 'react';
import '../designs/Login.css';

function Login() {
    return (
      <div className="login-page">
        <header className="login-header">
          <img src="ruta/a/la/imagen-del-logo.png" alt="ARAST Logo" className="login-logo" />
          <h1>APLICATIVO REGISTRO DE AUSENTISMO Y SUSPENSIÓN TEMPORAL</h1>
        </header>
        
        <div className="login-container">
          <h2>Inicio de sesion</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit" className="login-button">
              <i className="icon-login"></i> Inicio de sesión
            </button>
          </form>
        </div>
        
        <footer className="login-footer">
          <p>&copy; 2024 Quito Tenis y Golf Club</p>
        </footer>
      </div>
    );
  }
  
export default Login;

