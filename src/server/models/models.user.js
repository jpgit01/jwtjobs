import sqlConnection from '../../database/sqlConnection.js'
import bcrypt from 'bcryptjs'

export const registrarUsuario = async ({ email, password, rol, lenguage }) => {
  const query = 'INSERT INTO usuarios (id, email, password, rol, lenguage) VALUES (DEFAULT, $1, $2, $3, $4) RETURNING *;'
  const passwordEncriptada = await bcrypt.hash(password, 10)
  const values = [email, passwordEncriptada, rol, lenguage]
  const result = await sqlConnection(query, values)
  if (result.rowCount === 0) {
    throw new Error('No se pudo crear el registro')
  }
}

export const verificarCredenciales = async (email, password) => {
  const query = 'SELECT * FROM usuarios WHERE email = $1;'
  const values = [email]

  const { rows: [usuario], rowCount } = await sqlConnection(query, values)
  const passwordEncriptada = usuario.password
  const passwordCorrecta = await bcrypt.compare(password, passwordEncriptada)
  if (!passwordCorrecta || !rowCount) {
    const newError = { code: 401, message: 'email o contraseña incorrecta' }
    throw newError
  }
}

export const getUser = async (email) => {
  try {
    const query = 'SELECT email, rol, lenguage FROM usuarios WHERE email = $1;'
    const values = [email]
    const { rows } = await sqlConnection(query, values)
    return rows
  } catch (error) {
    console.error('Error en getUser:', error)
    throw new Error('Error al obtener el usuario')
  }
}
