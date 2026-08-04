import {
  clearTables,
  dumpTables,
  loadDbUrls,
  migrateDb,
  removeDump,
  restoreTables,
  runScript,
} from './common'

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

runScript(main)
