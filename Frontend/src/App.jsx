import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Login } from './pages/Login'
import  Dashboard  from './layout/Dashboard'

function App(){

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login/>}/>
          <Route path='dashboard/*' element={
            <Routes>
              <Route index element={<Dashboard/>}></Route>
            </Routes>
          }/>
        </Routes>
      </BrowserRouter>
    
    </>
    
  )
}
export default App