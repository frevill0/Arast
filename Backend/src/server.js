import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routerAusentismo from './routers/Ausentismos_routes.js'
import routerUsuarios from './routers/Usuarios_routes.js'
import routerCuotas from './routers/Cuotas_routes.js'
import routerSuspencion from './routers/Suspensiones_routes.js'
import routerReingreso from './routers/Reingreso_routes.js'
import routerReportes from './routers/Reportes_routes.js'

const app = express()
dotenv.config()

app.get('/arast', (req, res) => {
    res.send("Server online, bienvenido a Arast")
  })

app.set('port',process.env.PORT || 3000)

app.use(cors())
app.use(express.json())

app.use('/arast',routerAusentismo)
app.use('/arast',routerUsuarios)
app.use('/arast',routerCuotas)
app.use('/arast',routerSuspencion)
app.use('/arast',routerReingreso)
app.use('/arast',routerReportes)

app.use((req,res) => res.status(404).send("Endpoint no encontrado - 404"))

export default app