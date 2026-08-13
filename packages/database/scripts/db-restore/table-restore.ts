import { loadDbUrls } from './utils/env'
import {
  clearTables,
  dumpTables,
  migrateDb,
  removeDump,
  restoreTables,
} from './utils/restoreSteps'

function main() {
  const tables = process.argv.slice(2)

  if (tables.length === 0) {
    console.log('Usage: pnpm db:restore-table <TABLE_NAME> [TABLE_NAME2] ...')
    console.log('Example: pnpm db:restore-table IndexerState')
    console.log(
      'Example: pnpm db:restore-table IndexerState IndexerConfiguration',
    )
    process.exit(1)
  }

  const urls = loadDbUrls()

  console.log(`Restoring tables: ${tables.join(' ')}`)

  clearTables(urls.localDbUrl, tables)
  migrateDb(urls.localDbUrl)
  dumpTables(urls.remoteDbUrl, tables)
  restoreTables(urls.localDbUrl)
  removeDump()

  console.log(`✅ DB data restored for tables: ${tables.join(' ')}`)
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
