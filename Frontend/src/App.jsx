import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Login } from './pages/Login'
import  Dashboard  from './layout/Dashboard'
import RegistrarUsuarios from './pages/RegistrarUsuarios'
import ListarUsuarios from './pages/ListarUsuarios'
import AusentismoConsulta from './pages/AusentismoConsulta'
import CuotasConsulta from './pages/CuotasConsulta'
import RevisarAusentismo from './pages/RevisarAusentismo'
import Suspension from './pages/Suspension'
import Reactivacion from './pages/Reactivacion'
import {AuthProvider} from './context/AuthProvider'
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
              <Route path="usuarios/registrar" element={<RegistrarUsuarios />} />
              <Route index element = {<AusentismoConsulta/>}/>
              <Route path = "usuarios/revisarausentismo" element= {<RevisarAusentismo/>}/>
              <Route path="usuarios/cuotas" element={<CuotasConsulta/>} />
              <Route path="usuarios/suspension" element={<Suspension/>} />
              <Route path="usuarios/reactivacion" element={<Reactivacion/>} />
            </Route>
            
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
export default App