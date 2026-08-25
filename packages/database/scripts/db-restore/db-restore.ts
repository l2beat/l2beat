import { loadDbUrls } from './utils/env'
import { canConnect, isValidTimestamp } from './utils/psql'
import {
  clearTables,
  copyTablesSince,
  dumpTables,
  getTimestampedTables,
  migrateDb,
  removeDump,
  restoreTables,
} from './utils/restoreSteps'

const FEATURES: Record<string, string[]> = {
  da: [
    'IndexerState',
    'IndexerConfiguration',
    'DataAvailability',
    'Blob',
    'SyncMetadata',
  ],
  liveness: [
    'IndexerState',
    'IndexerConfiguration',
    'Liveness',
    'AggregatedLiveness',
  ],
  tvs: [
    'IndexerState',
    'IndexerConfiguration',
    'TvsBlockTimestamp',
    'TvsPrice',
    'TvsAmount',
    'TokenValue',
    'SyncMetadata',
  ],
  activity: [
    'IndexerState',
    'IndexerConfiguration',
    'Activity',
    'SyncMetadata',
  ],
  shared: [
    'IndexerState',
    'IndexerConfiguration',
    'AnomalyStats',
    'RealTimeLiveness',
    'RealTimeAnomaly',
  ],
  interop: [
    'IndexerState',
    'IndexerConfiguration',
    'InteropEvent',
    'InteropMessage',
    'InteropTransfer',
    'InteropConfig',
    'InteropRecentPrices',
    'InteropPluginSyncState',
    'InteropPluginSyncedRange',
  ],
  'interop-aggregates': [
    'IndexerState',
    'IndexerConfiguration',
    'AggregatedInteropTransfer',
    'AggregatedInteropToken',
    'InteropAggregateStatus',
  ],
  'token-db': [
    'AbstractToken',
    'DeployedToken',
    'TokenRelation',
    'Chain',
    'TokenDbSettings',
    'TokenIngestionQueue',
    'TokenDbHistory',
  ],
  'tracked-txs': [
    'IndexerState',
    'IndexerConfiguration',
    'L2Cost',
    'Liveness',
    'AggregatedL2Cost',
    'AggregatedLiveness',
  ],
  privacy: [
    'IndexerState',
    'IndexerConfiguration',
    'PrivacyBlockTimestamp',
    'PrivacyFlowEvent',
    'PrivacyPrice',
    'PrivacyRelayerSample',
  ],
}

// Versioned state tables where the latest row per key must survive the
// cutoff (e.g. InteropConfig, read via latest-per-key) — always copy in full
const FULL_COPY_OVERRIDES = ['InteropConfig']

function main() {
  const [feature, since] = process.argv.slice(2)

  if (!feature) {
    console.log('Usage: pnpm db:restore <FEATURE> [SINCE]')
    console.log(`Available features: ${Object.keys(FEATURES).join(' ')}`)
    console.log(
      'SINCE (optional): only copy rows with "timestamp" >= SINCE, e.g. 2026-07-01',
    )
    process.exit(1)
  }

  const tables = FEATURES[feature]
  if (!tables) {
    console.error(`Error: Feature '${feature}' not found.`)
    console.error(`Available features: ${Object.keys(FEATURES).join(' ')}`)
    process.exit(1)
  }

  const urls = loadDbUrls()

  // Fail on an invalid cutoff before any local data is wiped
  if (since) {
    if (!canConnect(urls.localDbUrl)) {
      console.error(
        'Error: cannot connect to the local database (DEV_LOCAL_DB_URL). Is it running?',
      )
      process.exit(1)
    }
    if (!isValidTimestamp(urls.localDbUrl, since)) {
      console.error(`Error: SINCE value '${since}' is not a valid timestamp.`)
      process.exit(1)
    }
  }

  clearTables(urls.localDbUrl, tables)
  migrateDb(urls.localDbUrl)

  // With SINCE, tables with a "timestamp" column on the remote are copied
  // row-by-row from the cutoff; everything else is dumped in full
  const timestamped = since
    ? getTimestampedTables(urls.remoteDbUrl, tables)
    : []
  const sinceTables = tables.filter(
    (table) =>
      timestamped.includes(table) && !FULL_COPY_OVERRIDES.includes(table),
  )
  const fullTables = tables.filter((table) => !sinceTables.includes(table))

  if (fullTables.length > 0) {
    dumpTables(urls.remoteDbUrl, fullTables)
    restoreTables(urls.localDbUrl)
    removeDump()
  }

  if (since && sinceTables.length > 0) {
    copyTablesSince(urls, since, sinceTables)
  }

  console.log(
    `✅ DB data restored for feature '${feature}'${since ? ` (since ${since})` : ''}`,
  )
}

try {
  main()
} catch (error) {
  if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
    console.error(
      'Error: a required tool was not found. Make sure psql, pg_dump and pg_restore are on your PATH.',
    )
  } else if (error instanceof Error && !('status' in error)) {
    // Only echo messages from our own throws — child-process failures
    // ('status' present) already printed their error via inherited stderr,
    // and their message embeds the full command line including the DB URL
    console.error(error.message)
  }
  console.error('❌ Restore failed.')
  process.exit(1)
}
