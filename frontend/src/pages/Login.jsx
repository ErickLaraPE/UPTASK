import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import Alerta from '../components/Alerta'
import clienteAxios from '../config/ClienteAxios'
import useAuth from '../hooks/useAuth'

export const Login = () => {

    const [email,setEmail] = useState('') // estado para almacenar el email
    const [password,setPassword] = useState('') // estado para almacenar el password
    const [alerta,setAlerta] = useState({}) // estado de alertas

    const {setAuth} = useAuth() // grabar el estado del usuario autenticado, funcion traida del Provider de Autenticacion

    const navigate = useNavigate()

    const handleSubmit = async (e) => {

        e.preventDefault()

        if([email,password].includes('')){
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }
        try {
            const {data} = await clienteAxios.post(`/usuarios/login`,{email,password})
            setAlerta({})
            localStorage.setItem('token', data.token)
            setAuth(data)
            navigate('/proyectos')
        } catch (error){
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(()=>{
                setAlerta({})
            },3000)
        }
    }

    const { msg } = alerta

    return(
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">Inicia sesion y administra 
            tus  {' '}   <span className="text-slate-700">proyectos</span>
            </h1>

            {msg && <Alerta alerta={alerta}/>}

            <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg px-10 py-5">
                <div className="my-5">
                    <label 
                        className="uppercase text-gray-600 block text-xl font-bold"
                        htmlFor="email"
                    >Email</label>
                    <input 
                        id="email"
                        type="email" 
                        onChange={e=>setEmail(e.target.value)}
                        value={email}
                        placeholder="Email de Registro"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                    />
                </div>
                <div className="my-5">
                    <label 
                        className="uppercase text-gray-600 block text-xl font-bold"
                        htmlFor="password"
                    >Password</label>
                    <input 
                        id="password"
                        type="password" 
                        onChange={e=>setPassword(e.target.value)}
                        value={password}
                        placeholder="Password de Registro"
                        className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
                    />
                </div>
                <input
                    type='submit'
                    value='Iniciar Sesión'
                    className='bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded 
                    hover:cursor-pointer hover:bg-sky-800 transition-colors'
                />
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link 
                className='block text-center my-5 text-slate-500 uppercase text-sm'
                to="registrar">¿No tienes cuenta? Registrate</Link>
                <Link 
                className='block text-center my-5 text-slate-500 uppercase text-sm'
                to="olvide-password">Olvidé mi password</Link>
            </nav>
        </>  
    )
}