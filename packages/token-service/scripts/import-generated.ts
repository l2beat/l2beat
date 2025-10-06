import { createTokenDatabase } from '@l2beat/database'
import { config as dotenv } from 'dotenv'
import { planAndExecute } from '../src/execution'

function getTestDatabase() {
  dotenv()
  const connection = process.env['TEST_DB_URL']
  if (!connection || connection === '') {
    throw new Error('Please setup TEST_DB_URL env variable')
  }

  return createTokenDatabase({
    connectionString: connection,
  })
}

async function main() {
  console.log('Importing tokens')
  const db = getTestDatabase()
  try {
    await planAndExecute(db, {
      type: 'AddAbstractTokenIntent',
      record: {
        id: 'te5t7',
        symbol: 'ADRr4',
        issuer: 'Adrian3',
        category: 'rwa',
      },
    })
  } finally {
    await db.close()
  }
}

main()
