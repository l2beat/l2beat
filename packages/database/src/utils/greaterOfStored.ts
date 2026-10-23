import { type RawBuilder, sql } from 'kysely'

/**
 * For the update of an upsert: the larger of the stored value and the inserted
 * one. Postgres' greatest skips nulls, so a value replaces a stored null
 */
export function greaterOfStored(
  table: string,
  column: string,
): RawBuilder<number | null> {
  const stored = sql.ref(`${table}.${column}`)
  const inserted = sql.ref(`excluded.${column}`)
  return sql`greatest(${stored}, ${inserted})`
}
