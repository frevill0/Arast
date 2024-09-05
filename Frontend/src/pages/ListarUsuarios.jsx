import React from 'react'
import TablaUsuarios from '../components/TablaUsuarios'
import Dashboard from '../layout/Dashboard'

const ListarUsuarios = () => {
    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'> Usuarios Registrados</h1>
            <hr className='my-4' />
            <p className='mb-8'>Este módulo te permite visulizar todos los usuarios que se encuentran registrados. Además, puedes: eliminar, ver el detalle y actualizar sus datos.</p>
            <TablaUsuarios/>
        </div>
    )
}

export default ListarUsuarios