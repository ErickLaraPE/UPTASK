import { useState,useEffect } from "react"
import { useParams } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"
import Alerta from "./Alerta"

const FormularioProyecto = () => {

    const [id,setId] = useState(null) // estado de id del usuario
    const [nombre, setNombre] = useState('') // estado del nombre que se ingrese
    const [descripcion, setDescripcion] = useState('') // estado de la descripcion que se ingrese
    const [fechaEntrega, setFechaEntrega] = useState('') // estado de la fechaEntrega que se ingrese
    const [cliente, setCliente] = useState('') // estado del cliente que se ingrese
    
    const params = useParams()//parametros de la url

    const { mostrarAlerta,alerta,submitProyecto,proyecto } = useProyectos()
    // estados de alertas y de enviar el proyecto obtenido del Provider de Proyectos
    useEffect(()=>{
        if(params.id){
            setId(proyecto._id)
            setNombre(proyecto.nombre)
            setDescripcion(proyecto.descripcion)
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
            setCliente(proyecto.cliente)
        }
    },[params])

    const handleSubmit = async e => {
        e.preventDefault()

        if([nombre,descripcion,fechaEntrega,cliente].includes('')){
            mostrarAlerta({
                msg: 'Todos los Campos son Obligatorios',
                error: true
            })
            return
        }
        await submitProyecto({id,nombre,descripcion,fechaEntrega,cliente})
        setId(null)
        setNombre('')
        setDescripcion('')
        setFechaEntrega('')
        setCliente('')
    }
    const { msg } = alerta

    return(
        <form 
            className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
            onSubmit={handleSubmit}>

            {msg && <Alerta alerta={alerta}/>}

            <div className="mb-5">
                <label
                    className = "text-gray-700 uppercase font-bold text-sm"
                    htmlFor = "nombre"
                >Nombre Proyecto</label>
                < input
                    id="nombre"
                    type="text"
                    className="border w-full p-2 mt-2 placeholder-gray-400 
                    rounded-md"
                    placeholder="Nombre del Proyecto"
                    value={nombre}
                    onChange={e=>setNombre(e.target.value)}
                />
            </div>
            <div className="mb-5">
                <label
                    className = "text-gray-700 uppercase font-bold text-sm"
                    htmlFor = "descripcion"
                >Descripcion</label>
                < textarea
                    id="descripcion"
                    type="text"
                    className="border w-full p-2 mt-2 placeholder-gray-400 
                    rounded-md"
                    placeholder="Descripcion del Proyecto"
                    value={descripcion}
                    onChange={e=>setDescripcion(e.target.value)}
                />
            </div>
            <div className="mb-5">
                <label
                    className = "text-gray-700 uppercase font-bold text-sm"
                    htmlFor = "fechaEntrega"
                >Fecha de Entrega</label>
                < input
                    id="fechaEntrega"
                    type="date"
                    className="border w-full p-2 mt-2 placeholder-gray-400 
                    rounded-md"
                    placeholder="Fecha de Entrega del Proyecto"
                    value={fechaEntrega}
                    onChange={e=>setFechaEntrega(e.target.value)}
                />
            </div>
            <div className="mb-5">
                <label
                    className = "text-gray-700 uppercase font-bold text-sm"
                    htmlFor = "cliente"
                >Nombre Cliente</label>
                < input
                    id="cliente"
                    type="text"
                    className="border w-full p-2 mt-2 placeholder-gray-400 
                    rounded-md"
                    placeholder="Cliente del Proyecto"
                    value={cliente}
                    onChange={e=>setCliente(e.target.value)}
                />
            </div>
            <input
                type="submit"
                value={id ? 'Actualizar Proyecto': 'Crear Proyecto' }
                className="bg-sky-600 w-full p-3 uppercase font-bold text-white
                rounded cursor-pointer hover:bg-sky-700"
            />
        </form>
    )
}

export default FormularioProyecto