import React, { useContext, useState } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import LogoPrincipal from '../assets/LogoQTGC.png'
import AuthContext from '../context/AuthProvider';
import { MdDashboard, MdPeople, MdAssignment, MdAutorenew, MdBarChart, MdAttachMoney, MdExpandMore, MdExpandLess, MdMenu } from 'react-icons/md';

const Dashboard = () => {
  const {auth} = useContext(AuthContext)
  const [showSubItemsAusentismo, setShowSubItemsAusentismo] = useState(false);
  const [showSubItemsReportes, setShowSubItemsReportes] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const autenticado = localStorage.getItem('token');

  const toggleSubItemsAusentismo = () => {
    setShowSubItemsAusentismo(!showSubItemsAusentismo);
  };

  const toggleSubItemsReportes = () => {
    setShowSubItemsReportes(!showSubItemsReportes);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Botón de menú móvil */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-[#0f172a] text-white"
      >
        <MdMenu className="text-2xl" />
      </button>

      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-[#0f172a] text-white flex flex-col shadow-xl 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section - Fixed */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-700 shrink-0">
          <img src={LogoPrincipal} alt="Logo" className="w-12 h-12" />
          <h1 className="text-2xl font-bold tracking-wider">ARAST</h1>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto py-6">
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
                    <Link to="/dashboard/usuarios/reporte27" className="block py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors">
                      Reporte 27 años
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/usuarios/reporte65" className="block py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors">
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
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <header className="bg-[#0f172a] text-white shadow-lg p-4">
          <div className="flex items-center justify-end px-4">
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline font-medium">
                Bienvenido, {auth?.nombre}
              </span>
              <Link
                to="/"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg 
                         transition-all duration-300 shadow-md text-sm sm:text-base"
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
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto bg-gray-50">
          {autenticado ? <Outlet /> : <Navigate to="/" />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
