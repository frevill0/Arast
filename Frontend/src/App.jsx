import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Login } from './pages/Login'
import  Dashboard  from './layout/Dashboard'
import ListarUsuarios from './pages/ListarUsuarios'
import AusentismoConsulta from './pages/AusentismoConsulta'
import CuotasConsulta from './pages/CuotasConsulta'
import RevisarAusentismo from './pages/RevisarAusentismo'
import Suspension from './pages/Suspension'
import Reactivacion from './pages/Reactivacion'
import {AuthProvider} from './context/AuthProvider'
import Reporte27 from './pages/Reporte27'
import Reporte65 from './pages/Reporte65'
function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            
            {/* Dashboard con rutas hijas */}
            <Route path="dashboard" element={<Dashboard />}>
              <Route path="usuarios/listar" element={<ListarUsuarios />} />
              <Route index element = {<AusentismoConsulta/>}/>
              <Route path = "usuarios/revisarausentismo" element= {<RevisarAusentismo/>}/>
              <Route path="usuarios/cuotas" element={<CuotasConsulta/>} />
              <Route path="usuarios/suspension" element={<Suspension/>} />
              <Route path="usuarios/reactivacion" element={<Reactivacion/>} />
              <Route path="usuarios/reporte27" element={<Reporte27/>} />
              <Route path="usuarios/reporte65" element={<Reporte65/>} />
            </Route>
            
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
export default App