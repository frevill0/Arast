import React from 'react'
import { FormularioUsuarios } from '../components/FormularioUsuarios'

const RegistrarUsuarios = () => {
    return (
        <div>
            
            <h1 className='font-black text-4xl text-gray-500'>Usuarios</h1>
            <hr className='my-4' />
            <p className='mb-8'>Este módulo te permite registrar un nuevo usuario</p>
            <FormularioUsuarios/>
        </div>
    )
}

export default RegistrarUsuarios