import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import Database, { type Database as SqliteDatabase } from 'better-sqlite3'

const DB_PATH = resolve(process.cwd(), 'data/privacy.db')

const SCHEMA = `
CREATE TABLE IF NOT EXISTS privacy_bucket_snapshot (
  project_id          TEXT    NOT NULL,
  asset_key           TEXT    NOT NULL,
  bucket_id           TEXT    NOT NULL,
  timestamp           INTEGER NOT NULL,
  total_value_amount  TEXT,
  price_usd           REAL,
  total_value_usd     REAL,
  deposits_total      INTEGER NOT NULL,
  deposits_7d         INTEGER NOT NULL,
  deposits_30d        INTEGER NOT NULL,
  PRIMARY KEY (project_id, asset_key, bucket_id)
);
CREATE INDEX IF NOT EXISTS idx_privacy_project ON privacy_bucket_snapshot(project_id);
`

let db: SqliteDatabase | undefined

export function getPrivacyDb(): SqliteDatabase {
  if (db) return db

  mkdirSync(dirname(DB_PATH), { recursive: true })
  db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('synchronous = NORMAL')
  db.exec(SCHEMA)
  return db
}
