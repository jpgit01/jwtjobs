import 'dotenv/config'
import jwt from 'jsonwebtoken'

const JWT_KEY = process.env.JWT_KEY

if (!JWT_KEY) {
  throw new Error('JWT_KEY no esta definida')
}

export const jwtSign = (payload) => {
  return jwt.sign(payload, JWT_KEY)
}

export const jwtVerify = (token) => {
  try {
    return jwt.verify(token, JWT_KEY)
  } catch (error) {
    throw new Error('Error al verificar el token: ' + error.message)
  }
}

export const jwtDecode = (token) => {
  try {
    return jwt.decode(token, JWT_KEY)
  } catch (error) {
    throw new Error('Error al decodificar el token: ' + error.message)
  }
}
