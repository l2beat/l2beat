import {
  type AbstractTokenRecord,
  createTokenDatabase,
  type TokenDatabase,
} from '@l2beat/database'
import { config as dotenv } from 'dotenv'
import { planAndExecute } from '../src/execution'
import transformed from './transformed.json'

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

async function importTransformed(db: TokenDatabase) {
  for (const abstractToken of transformed.abstractTokens) {
    const match = /^(.*?):(.*?)\.(.*)$/.exec(abstractToken.id)
    if (!match) {
      throw new Error(`Invalid abstract token id: ${abstractToken.id}`)
    }
    const [_all, id, issuer, symbol] = match
    const record: AbstractTokenRecord = {
      id,
      issuer: issuer === 'unknown' ? undefined : issuer,
      symbol,
      category: abstractToken.category,
      coingeckoId: abstractToken.coingeckoId,
      coingeckoListingTimestamp: new Date(
        abstractToken.coingeckoListingTimestamp * 1000,
      ),
      iconUrl: abstractToken.iconUrl,
    }
    console.log(`Adding ${id}:${issuer}:${symbol}...`)
    await planAndExecute(db, {
      type: 'AddAbstractTokenIntent',
      record,
    })
  }
}

async function main() {
  console.log('Importing tokens')
  const db = getTestDatabase()
  try {
    await planAndExecute(db, { type: 'DeleteAllAbstractTokensIntent' })
    await importTransformed(db)
  } finally {
    await db.close()
  }
}

main()
