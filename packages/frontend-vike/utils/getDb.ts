import { type Database, createDatabase } from '@l2beat/database'

let db: Database | undefined

export function getDb() {
  if (!db) {
    db = createDatabase({
      application_name: 'FE-react-router',
      connectionString: import.meta.env.DATABASE_URL,
      ssl: ssl(),
      ...pool(),
    })
  }

  return db
}

function ssl() {
  return process.env.NODE_ENV === 'production' ||
    import.meta.env.DATABASE_URL?.includes('amazonaws.com')
    ? { rejectUnauthorized: false }
    : undefined
}

function pool() {
  return {
    min: 2,
    max: 5,
  }
}
