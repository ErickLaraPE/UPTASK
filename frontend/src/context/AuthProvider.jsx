import {useState, useEffect, createContext} from 'react'
import {useNavigate} from 'react-router-dom'
import clienteAxios from '../config/ClienteAxios'

const AuthContext = createContext()

const AuthProvider = ({children}) => {

    const [auth,setAuth] = useState({}) // estado del usuario autenticado
    const [cargando,setCargando] = useState(true) //estado de cargando

    const navigate = useNavigate()

    useEffect(() => {
        // Cuando la API devuelve el token del usuario encontrado y se guarda en el local storage
        // se obtiene dicho token del local y se redirige al usuario autenticado a 
        // la ventana de proyectos

        //La funcion autenticarUsuario se usa en caso el usuario retrocede a la pagina de login ya no tenga que loguearse nuevamente
        // sino sera redirigido a proyectos. 
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token')
            if(!token){
                setCargando(false)
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const {data} = await clienteAxios('/usuarios/perfil',config)
                setAuth(data)
                navigate('/proyectos')

            } catch (error) {
                setAuth({})
            } 
            setCargando(false)       
        }
        autenticarUsuario()
    },[])

    const cerrarSesionAuth = () => {
        setAuth({})
    }

    return(
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext
