import { type RawBuilder, sql } from 'kysely'

/**
 * For the update of an upsert, of a nullable count: the stored value plus the
 * inserted one. A null adds nothing, so a count a chain only started
 * reporting keeps its value
 */
export function addToStored(
  table: string,
  column: string,
): RawBuilder<number | null> {
  const stored = sql.ref(`${table}.${column}`)
  const inserted = sql.ref(`excluded.${column}`)
  return sql`coalesce(${stored} + ${inserted}, ${inserted}, ${stored})`
}
