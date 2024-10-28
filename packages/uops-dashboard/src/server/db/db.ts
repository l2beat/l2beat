import * as fs from 'node:fs/promises'

export type DB = {
  CONTRACTS: Map<string, string>
  METHODS: Map<string, string>
  IMPLEMENTATIONS: Map<string, string>
}

const dbFilePath = `${process.cwd()}/db.json`

export async function loadDb(): Promise<DB> {
  console.log('Loading DB')
  const data = await fs.readFile(dbFilePath, 'utf8')
  const parsedData = JSON.parse(data)

  return {
    CONTRACTS: new Map(parsedData.CONTRACTS),
    METHODS: new Map(parsedData.METHODS),
    IMPLEMENTATIONS: new Map(parsedData.IMPLEMENTATIONS),
  }
}

export async function saveDb(db: DB) {
  if (!process.env.DB_UPDATE) {
    return
  }

  const data = {
    CONTRACTS: Array.from(db.CONTRACTS),
    METHODS: Array.from(db.METHODS),
    IMPLEMENTATIONS: Array.from(db.IMPLEMENTATIONS),
  }
  await fs.writeFile(dbFilePath, JSON.stringify(data, null, 2), 'utf8')
  console.log('DB updated')
}
