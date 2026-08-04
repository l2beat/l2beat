import { execFileSync } from 'child_process'
import fs from 'fs'
import type { DbUrls } from './env'
import { psqlExec, psqlQuery, quoteIdent, quoteLiteral } from './psql'

const DUMP_FILE = './db.pgdump'

export function clearTables(localDbUrl: string, tables: string[]): void {
  console.log(`Clearing local tables: ${tables.join(' ')}`)
  const existing = psqlQuery(
    localDbUrl,
    `SELECT tablename FROM pg_tables
     WHERE schemaname = 'public'
       AND tablename IN (${tables.map(quoteLiteral).join(', ')})`,
  )
  if (existing.length === 0) {
    return
  }
  psqlExec(localDbUrl, `TRUNCATE TABLE ${existing.map(quoteIdent).join(', ')}`)
}

export function migrateDb(localDbUrl: string): void {
  console.log('Migrating DB to latest')
  execFileSync('pnpm', ['prisma', 'migrate', 'deploy'], {
    stdio: 'inherit',
    env: { ...process.env, PRISMA_DB_URL: localDbUrl },
  })
}

export function dumpTables(remoteDbUrl: string, tables: string[]): void {
  console.log(
    `Dumping tables from remote: ${tables.join(' ')} (this may take a while)...`,
  )
  // Table patterns are wrapped in double quotes so pg_dump keeps their case
  const tableArgs = tables.flatMap((table) => ['-t', quoteIdent(table)])
  execFileSync(
    'pg_dump',
    ['-d', remoteDbUrl, ...tableArgs, '-a', '-F', 'c', '-f', DUMP_FILE],
    { stdio: 'inherit' },
  )
}

export function restoreTables(localDbUrl: string): void {
  console.log('Restoring tables (this may take a while)...')
  execFileSync('pg_restore', ['-d', localDbUrl, DUMP_FILE, '--verbose'], {
    stdio: 'inherit',
  })
}

export function removeDump(): void {
  console.log('Removing dump')
  fs.unlinkSync(DUMP_FILE)
}

export function getTimestampedTables(
  remoteDbUrl: string,
  tables: string[],
): string[] {
  return psqlQuery(
    remoteDbUrl,
    `SELECT table_name FROM information_schema.columns
     WHERE table_schema = 'public'
       AND column_name = 'timestamp'
       AND table_name IN (${tables.map(quoteLiteral).join(', ')})`,
  )
}

// pg_dump cannot filter rows, so tables with a "timestamp" column are copied
// row-by-row with a WHERE clause instead
export function copyTablesSince(
  urls: DbUrls,
  since: string,
  tables: string[],
): void {
  for (const table of tables) {
    console.log(`Copying "${table}" since ${since} (this may take a while)...`)
    // Use the remote column list on both sides so the copy still works when
    // local migrations added columns the remote does not have yet
    const [columns] = psqlQuery(
      urls.remoteDbUrl,
      `SELECT string_agg(format('%I', column_name), ', ' ORDER BY ordinal_position)
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = ${quoteLiteral(table)}`,
    )
    if (!columns) {
      throw new Error(`Table "${table}" not found on the remote database.`)
    }
    const copyFile = `./${table}.copy`
    psqlExec(
      urls.remoteDbUrl,
      `\\copy (SELECT ${columns} FROM ${quoteIdent(table)} WHERE "timestamp" >= ${quoteLiteral(since)}) TO '${copyFile}'`,
    )
    psqlExec(
      urls.localDbUrl,
      `\\copy ${quoteIdent(table)} (${columns}) FROM '${copyFile}'`,
    )
    fs.unlinkSync(copyFile)
    syncSequences(urls.localDbUrl, table)
  }
}

// COPY writes explicit ID values without advancing the owned sequences
// (pg_restore does that via sequence-set data), so bump them to the copied
// maximum to avoid uniqueness violations on future local inserts
export function syncSequences(localDbUrl: string, table: string): void {
  const tableRef = quoteLiteral(quoteIdent(table))
  const sequences = psqlQuery(
    localDbUrl,
    `SELECT a.attname, pg_get_serial_sequence(${tableRef}, a.attname)
     FROM pg_attribute a
     WHERE a.attrelid = ${tableRef}::regclass
       AND a.attnum > 0
       AND NOT a.attisdropped
       AND pg_get_serial_sequence(${tableRef}, a.attname) IS NOT NULL`,
  )
  for (const line of sequences) {
    // psql -A separates columns with '|'
    const [column, sequence] = line.split('|')
    if (!column || !sequence) {
      continue
    }
    // No row matches when the table is empty (max is NULL), skipping the bump
    psqlQuery(
      localDbUrl,
      `SELECT setval(${quoteLiteral(sequence)}, max_val)
       FROM (SELECT MAX(${quoteIdent(column)})::bigint AS max_val FROM ${quoteIdent(table)}) m
       WHERE max_val > 0`,
    )
  }
}
