import React, { useContext, useState } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import LogoPrincipal from '../assets/LogoQTGC.png'
import AuthContext from '../context/AuthProvider';
import { MdDashboard, MdPeople, MdAssignment, MdAutorenew, MdBarChart, MdAttachMoney, MdExpandMore, MdExpandLess } from 'react-icons/md';

const Dashboard = () => {
  const {auth} = useContext(AuthContext)
  const [showSubItemsAusentismo, setShowSubItemsAusentismo] = useState(false);
  const [showSubItemsReportes, setShowSubItemsReportes] = useState(false);
  const autenticado = localStorage.getItem('token');

  const toggleSubItemsAusentismo = () => {
    setShowSubItemsAusentismo(!showSubItemsAusentismo);
  };

  const toggleSubItemsReportes = () => {
    setShowSubItemsReportes(!showSubItemsReportes);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col shadow-xl">
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-700">
          <img src={LogoPrincipal} alt="Logo" className="w-12 h-12" />
          <h1 className="text-2xl font-bold tracking-wider">ARAST</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-grow py-6">
          <ul className="space-y-1.5">
            {(auth.rol === "administrador" || auth.rol ==="usuario") && (
              <>
                {/* Ausentismo Section */}
                <li className="mx-3">
                  <div 
                    onClick={toggleSubItemsAusentismo} 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <MdDashboard className="text-xl" />
                      <span className="font-medium">AUSENTISMO</span>
                    </div>
                    {showSubItemsAusentismo ? <MdExpandLess /> : <MdExpandMore />}
                  </div>
                  {showSubItemsAusentismo && (
                    <ul className="mt-2 ml-12 space-y-1">
                      <li>
                        <Link to='/dashboard' className="block py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors">
                          Registrar Migración
                        </Link>
                      </li>
                      <li>
                        <Link to="usuarios/revisarausentismo" className="block py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors">
                          Revisar
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <li className="mx-3">
                  <Link to='usuarios/suspension' className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                    <MdAssignment className="text-xl" />
                    <span className="font-medium">SUSPENSIÓN</span>
                  </Link>
                </li>

                <li className="mx-3">
                  <Link to='usuarios/reactivacion' className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                    <MdAutorenew className="text-xl" />
                    <span className="font-medium">REINGRESO</span>
                  </Link>
                </li>
              </>
            )}

            {/* Reportes Section */}
            <li className="mx-3">
              <div 
                onClick={toggleSubItemsReportes} 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <MdBarChart className="text-xl" />
                  <span className="font-medium">REPORTES</span>
                </div>
                {showSubItemsReportes ? <MdExpandLess /> : <MdExpandMore />}
              </div>
              {showSubItemsReportes && (
                <ul className="mt-2 ml-12 space-y-1">
                  <li>
                    <Link to="#" className="block py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors">
                      Ausentismo
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="block py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors">
                      Reingreso
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="block py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors">
                      Suspensión Temporal
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="block py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors">
                      Reporte 27 años
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="block py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors">
                      Vitalicio
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="mx-3">
              <Link to='usuarios/cuotas' className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                <MdAttachMoney className="text-xl" />
                <span className="font-medium">CUOTAS</span>
              </Link>
            </li>

            {auth.rol === "administrador" && (
              <li className="mx-3">
                <Link to='/dashboard/usuarios/listar' className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                  <MdPeople className="text-xl" />
                  <span className="font-medium">USUARIOS</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#0f172a] text-white shadow-lg p-4">
          <div className="flex items-center justify-end px-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">
                Bienvenido, {auth?.nombre}
              </span>
              <Link
                to="/"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg 
                         transition-all duration-300 shadow-md"
                onClick={() => {
                  localStorage.removeItem('token');
                }}
              >
                Cerrar Sesión
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
          {autenticado ? <Outlet /> : <Navigate to="/" />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
