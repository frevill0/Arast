import React, { useState } from 'react';
import { Link, Navigate, Outlet, useLocation} from 'react-router-dom'


const Dashboard = () => {
  const [showSubItems, setShowSubItems] = useState(false);

  const toggleSubItems = () => {
    setShowSubItems(!showSubItems);
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
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={toggleSubItems}>
              <span>AUSENTISMO</span>
              {/* Sub-items for Introduction */}
              {showSubItems && (
                <ul className="ml-4">
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <a href="#overview">Overview</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <a href="#getting-started">Getting Started</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <a href="#requirements">Requirements</a>
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
            <li className="px-4 py-2 hover:bg-gray-700" onClick={toggleSubItems}>
            <span>USUARIOS</span>
              {/* Sub-items for Introduction */}
              {showSubItems && (
                <ul className="ml-4">
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <Link to='/usuarios/listar'>Listar</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700">
                    <Link to='/usuarios/registrar'>Registrar</Link>
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
        <main className="flex-grow bg-gray-100 p-8">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4">Quickstart</h1>
            <p>This guide will get you all set up and ready to use the Protocol API...</p>
            
            <div className="mt-4">
              <h2 className="text-xl font-semibold">Choose your client</h2>
              <p>Before making your first API request, you need to pick which API client you will use...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
