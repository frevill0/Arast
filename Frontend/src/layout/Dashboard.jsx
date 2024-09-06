import React, { useState } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';

const Dashboard = () => {
  const [showSubItemsAusentismo, setShowSubItemsAusentismo] = useState(false);
  const [showSubItemsUsuarios, setShowSubItemsUsuarios] = useState(false);
  const autenticado = localStorage.getItem('token');

  const toggleSubItemsAusentismo = () => {
    setShowSubItemsAusentismo(!showSubItemsAusentismo);
  };

  const toggleSubItemsUsuarios = () => {
    setShowSubItemsUsuarios(!showSubItemsUsuarios);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4">
          <h1 className="text-2xl font-bold">ARAST</h1>
        </div>
        <nav className="flex-grow">
          <ul>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={toggleSubItemsAusentismo}>
              <span>AUSENTISMO</span>
              {/* Sub-items for AUSENTISMO */}
              {showSubItemsAusentismo && (
                <ul className="ml-4">
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <a href="#overview">Registrar</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <a href="#getting-started">Revisar</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <a href="#requirements">Pagar</a>
                  </li>
                </ul>
              )}
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <a href="#quickstart">SUSPENSIÓN</a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <a href="#authentication">REINGRESO</a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <a href="#errors">REPORTES</a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <a href="#webhooks">CUOTAS</a>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={toggleSubItemsUsuarios}>
              <span>USUARIOS</span>
              {/* Sub-items for USUARIOS */}
              {showSubItemsUsuarios && (
                <ul className="ml-4">
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <Link to='/dashboard/usuarios/listar'>Listar</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <Link to='/dashboard/usuarios/registrar'>Registrar</Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content with Header */}
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <header className="bg-gray-900 shadow p-4 flex justify-between items-center">
          <div className="flex items-center justify-end w-full">
            <h1 className="text-white text-xl font-semibold mr-4">Bienvenido - Nombre Usuario</h1>
            <Link
              to="/"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => {
                localStorage.removeItem('token');
              }}
            >
              Salir
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <div className='overflow-y-scroll p-8'>
          {autenticado ? <Outlet /> : <Navigate to="/" />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
