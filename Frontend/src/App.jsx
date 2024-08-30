import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route index element = {<Login/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
