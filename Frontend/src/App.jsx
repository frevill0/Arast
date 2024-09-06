import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Login } from './pages/Login'
import  Dashboard  from './layout/Dashboard'
import RegistrarUsuarios from './pages/RegistrarUsuarios'
import ListarUsuarios from './pages/ListarUsuarios'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          
          {/* Dashboard con rutas hijas */}
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="usuarios/listar" element={<ListarUsuarios />} />
            <Route path="usuarios/registrar" element={<RegistrarUsuarios />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App