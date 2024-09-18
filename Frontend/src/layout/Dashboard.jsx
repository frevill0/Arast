import React, { useState } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import LogoPrincipal from '../assets/LogoQTGC.png'
const Dashboard = () => {
  const [showSubItemsAusentismo, setShowSubItemsAusentismo] = useState(false);
  const [showSubItemsUsuarios, setShowSubItemsUsuarios] = useState(false);
  const [showSubItemsSuspension, setShowSubItemsSuspension] = useState(false);
  const [showSubItemsReportes, setShowSubItemsReportes] = useState(false);
  const autenticado = localStorage.getItem('token');

  const toggleSubItemsAusentismo = () => {
    setShowSubItemsAusentismo(!showSubItemsAusentismo);
  };

  const toggleSubItemsUsuarios = () => {
    setShowSubItemsUsuarios(!showSubItemsUsuarios);
  };

  const toggleSubItemsSuspension = () => {
    setShowSubItemsSuspension(!showSubItemsSuspension);
  };

  const toggleSubItemsReportes = () => {
    setShowSubItemsReportes(!showSubItemsReportes);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-customBlue text-white flex flex-col">
        <div className="mb-8 flex  items-center">
        <img src={LogoPrincipal} alt="Logo" className="w-24 h-24" />
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
                  <Link to='/dashboard'>Registrar Migración</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <Link to="usuarios/revisarausentismo">Revisar</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <a href="#requirements">Pagar</a>
                  </li>
                </ul>
              )}
            </li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={toggleSubItemsSuspension}>
              <span>SUSPENSION</span>
              {/* Sub-items for AUSENTISMO */}
              {showSubItemsSuspension && (
                <ul className="ml-4">
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <a href="#getting-started">Suspensión</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <a href="#requirements">Liquidación</a>
                  </li>
                </ul>
              )}
            </li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={toggleSubItemsReportes}>
              <span>REPORTES</span>
              {showSubItemsReportes && (
                <ul className="ml-4">
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <a href="#overview">Ausentismo</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <a href="#getting-started">Reingreso</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <a href="#requirements">Suspención Temporal</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <a href="#requirements">Reporte 27 años</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <a href="#requirements">Alerta Suspensión</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <a href="#requirements">Vitalicio</a>
                  </li>
                </ul>
              )}
            </li>
            <li className="px-4 py-2 hover:bg-gray-700">
              <Link to='usuarios/cuotas' href="#webhooks">CUOTAS</Link>
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
        <header className="bg-customBlue shadow p-4 flex justify-between items-center">
          <div className="flex items-center justify-end w-full">
            <h1 className="text-white text-xl font-semibold mr-4">Bienvenido - frevill</h1>
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
