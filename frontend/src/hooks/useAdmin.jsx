import useProyectos from "./useProyectos";
import useAuth from "./useAuth";

const useAdmin = () => {
    const {proyecto} = useProyectos()
    const {auth} = useAuth()

    // Hook para saber si el usuario autenticado es el creador del proyecto
    return proyecto.creador === auth._id

}

export default useAdmin