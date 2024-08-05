import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { verificarCredenciales, registrarUsuario, getUser } from './models/models.user.js'

import { jwtSign, jwtDecode } from '../utils/auth/jwt.js'
import { authToken } from './middlewares/auth.middleware.js'

const PORT = process.env.PORT ?? 3000
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' })
    }
    await verificarCredenciales(email, password)
    const token = jwtSign({ email })
    res.status(200).json({ token })
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message || 'Error interno del servidor' })
  }
})

app.post('/usuarios', async (req, res) => {
  try {
    const { email, password, rol, lenguage } = req.body
    await registrarUsuario({ email, password, rol, lenguage })
    res.status(201).json({ status: true, message: 'Usuario registrado correctamente' })
  } catch (error) {
    res.status(error.code || 500).json({ message: 'Error', error })
  }
})

app.get('/usuarios', authToken, async (req, res) => {
  try {
    const authorization = req.header('Authorization')
    const [, token] = authorization.split(' ')
    const { email } = jwtDecode(token)
    const user = await getUser(email)
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ message: error })
  }
}
)

app.all('*', (req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada',
    error: {
      code: 404,
      message: 'No se encontró la ruta solicitada.'
    }
  })
})

app.listen(PORT, () => console.log('server up'))

export default app
