import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routerAusentismo from './routers/Austentismos_routes.js'
import routerUsuarios from './routers/Usuarios_routes.js'

const app = express()
dotenv.config()

app.set('port',process.env.PORT || 3000)

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.use('/arast',routerAusentismo)
app.use('/arast',routerUsuarios)

app.use((req,res) => res.status(404).send("Endpoint no encontrado - 404"))

export default app 