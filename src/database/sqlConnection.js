import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  allowExitOnIdle: true
})

const sqlConnection = async (query, values) => {
  try {
    const result = await pool.query(query, values)

    return {
      rows: result.rows,
      rowCount: result.rowCount
    }
  } catch (error) {
    const { code, message } = error
    const err = { code, message }
    throw err
  }
}

export default sqlConnection
