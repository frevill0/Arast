import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Login } from './pages/Login'
import  Dashboard  from './layout/Dashboard'
import RegistrarUsuarios from './pages/RegistrarUsuarios'
import ListarUsuarios from './pages/ListarUsuarios'

function App(){

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login/>}/>
          <Route path='dashboard/*' element={
            <Routes>
              <Route index element={<Dashboard/>}></Route>
              <Route path='/usuarios/listar' element={<ListarUsuarios/>}></Route>
              <Route path='/usuarios/registrar' element={<RegistrarUsuarios/>}></Route>
            </Routes>
          }/>       
        </Routes>
      </BrowserRouter>
    
    </>
    
  )
}
export default App