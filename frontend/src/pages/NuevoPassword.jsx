import { useState,useEffect } from 'react'
import clienteAxios from '../config/ClienteAxios'
import Alerta from '../components/Alerta'
import { Link,useParams } from "react-router-dom"

export const NuevoPassword = () => {

    const [alerta,setAlerta] = useState({})
    const [tokenValido,setTokenValido] = useState(false)
    const [passwordModificado,setPasswordModificado]=useState(false)
    const [password,setPassword] = useState('')
    const params = useParams()
    const { token } = params

    useEffect(() => {
        const comprobarToken = async () => {
            try {
                await clienteAxios(`/usuarios/olvide-password/${token}`) 
                setTokenValido(true)
            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error:true
                })
                setTimeout(()=>{
                    setAlerta({})
                },3000)
            }
        }
        comprobarToken()
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password.length < 6){
            setAlerta({
                msg:'El password debe ser minimo de 6 caracteres',
                error:true
            })
            return
        }
        try {
            const {data} = await clienteAxios.post(`/usuarios/olvide-password/${token}`,{password})
            setAlerta({
                msg: data.msg,
                error: false
            })
            setPasswordModificado(true)
            setTimeout(()=>{
                setAlerta({})
            },3000)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(()=>{
                setAlerta({})
            },3000)
        }
    }

    const {msg} = alerta
    
    return(
    <>
        <h1 className="text-sky-600 font-black text-6xl capitalize">Reestablece tu password y no pierdas acceso a
        tus  {' '}   <span className="text-slate-700">proyectos</span>
        </h1>

        {msg && <Alerta alerta={alerta}/>}

        { tokenValido && (
            <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg px-10 py-5">
            <div className="my-5">
                <label 
                    className="uppercase text-gray-600 block text-xl font-bold"
                    htmlFor="password"
                >Nuevo Password</label>
                <input 
                    id="password"
                    type="password"
                    onChange = {e => setPassword(e.target.value)}
                    value = {password}
                    placeholder="Escribe tu nuevo password"
                    className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
                />
            </div>
            <input
                type='submit'
                value='Guardar nuevo password'
                className='bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded 
                hover:cursor-pointer hover:bg-sky-800 transition-colors'
            />
            </form>
        )}
        { passwordModificado && (
           <Link 
                className='block text-center my-5 text-slate-500 uppercase text-sm'
                to="/"
           >Inicia Sesión</Link>
        )}
    </>  
    )
}