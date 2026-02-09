import pg from 'pg'

const { Pool } = pg

function getConnectionString() {
  return (
    (process.env.DATABASE_URL || '').trim() ||
    (process.env.NEON_DATABASE_URL || '').trim()
  )
}

function createPool() {
  const connectionString = getConnectionString()
  if (!connectionString) {
    throw new Error('DATABASE_URL (or NEON_DATABASE_URL) is not set')
  }

  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  })
}

export function getPool() {
  if (!globalThis.__qualfmDbPool) {
    globalThis.__qualfmDbPool = createPool()
  }
  return globalThis.__qualfmDbPool
}

export async function query(text, values = []) {
  const pool = getPool()
  return pool.query(text, values)
}
