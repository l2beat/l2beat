import {
  type AbstractTokenRecord,
  createTokenDatabase,
  type DeployedTokenRecord,
  type TokenDatabase,
} from '@l2beat/database'
import { config as dotenv } from 'dotenv'
import { planAndExecute } from '../src/execution'
import transformed from './transformed.json'

function getTestDatabase() {
  dotenv()

  const connection = process.env['LOCAL_DB_URL']
  if (!connection || connection === '') {
    throw new Error('Please setup LOCAL_DB_URL env variable')
  }

  return createTokenDatabase({
    connectionString: connection,
  })
}

function toAbstractToken(
  fileEntry: (typeof transformed.abstractTokens)[0],
): AbstractTokenRecord {
  const match = /^(.*?):(.*?)\.(.*)$/.exec(fileEntry.id)
  if (!match) {
    throw new Error(`Invalid abstract token id: ${fileEntry.id}`)
  }
  const [_all, id, issuer, symbol] = match
  return {
    id,
    issuer: issuer === 'unknown' ? null : issuer,
    symbol,
    category: fileEntry.category as AbstractTokenRecord['category'],
    coingeckoId: fileEntry.coingeckoId,
    coingeckoListingTimestamp: fileEntry.coingeckoListingTimestamp,
    iconUrl: fileEntry.iconUrl,
    reviewed: fileEntry.reviewed ?? false,
    comment: null,
  }
}

function toDeployedToken(
  fileEntry: (typeof transformed.deployedTokens)[0],
  deployedToAbstract: Record<string, string>,
): DeployedTokenRecord {
  const match = /^(.*?)\+(.*?) .*$/.exec(fileEntry.id)
  if (!match) {
    throw new Error(`Invalid abstract token id: ${fileEntry.id}`)
  }
  const [_all, chain, address] = match
  const assignedAbstractTokenId = deployedToAbstract[fileEntry.id]
  return {
    chain,
    address,
    symbol: fileEntry.symbol,
    abstractTokenId: assignedAbstractTokenId ?? null,
    decimals: fileEntry.decimals,
    deploymentTimestamp: fileEntry.deploymentTimestamp,
    comment: null,
  }
}

async function importTransformed(db: TokenDatabase) {
  const deployedToAbstract: Record<string, string> = {}
  for (const entry of transformed.abstractTokens) {
    const record = toAbstractToken(entry)

    for (const deployedId of entry.deployedTokens) {
      const existingAbstract = deployedToAbstract[deployedId]
      if (existingAbstract) {
        throw new Error(`DeployedToken ${deployedId} is already assigned to
        ${existingAbstract} but now tries to be assigned to ${record.id}`)
      }
      deployedToAbstract[deployedId] = record.id
    }

    console.log(`Adding ${record.id}:${record.issuer}:${record.symbol}`)
    await planAndExecute(db, {
      type: 'AddAbstractTokenIntent',
      record,
    })
  }

  for (const entry of transformed.deployedTokens) {
    const record = toDeployedToken(entry, deployedToAbstract)
    console.log(`Adding ${record.chain}+${record.address}`)
    await planAndExecute(db, {
      type: 'AddDeployedTokenIntent',
      record,
    })
  }
}

async function clearTokenTables(db: TokenDatabase) {
  console.log('Clearing all Abstract and Deployed tokens')
  await db.deployedToken.deleteAll()
  await db.abstractToken.deleteAll()
}

async function main() {
  console.log('Importing tokens')
  const db = getTestDatabase()
  try {
    await clearTokenTables(db)
    await importTransformed(db)
  } finally {
    await db.close()
  }
}

main()
