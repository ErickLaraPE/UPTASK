import express from 'express'
const router = express.Router()

import {obtenerProyectos,nuevoProyecto,obtenerProyecto,editarProyecto,eliminarProyecto,agregarColaborador,eliminarColaborador,buscarColaborador} from '../controllers/proyectoController.js'
import checkAuth from '../middleware/checkAuth.js'

router
    .route("/")
    .get(checkAuth,obtenerProyectos)
    .post(checkAuth,nuevoProyecto)

router
    .route("/:id")
    .get(checkAuth,obtenerProyecto)
    .put(checkAuth,editarProyecto)
    .delete(checkAuth,eliminarProyecto)

router.post('/colaboradores/:id',checkAuth,agregarColaborador)
router.post('/colaboradores',checkAuth,buscarColaborador)
router.post('/eliminar-colaborador/:id',checkAuth,eliminarColaborador)

export default router