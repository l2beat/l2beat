import { sql } from 'kysely'
import type { DatabaseClient } from '../kysely'

export async function getDatabaseStats(
  db: DatabaseClient,
): Promise<{ tableName: string; sizeInBytes: number }[]> {
  const tableSizes = await sql<{
    table_name: string
    size_bytes: number
  }>`
    SELECT
      relname AS table_name,
      pg_total_relation_size(relid) AS size_bytes
    FROM pg_stat_user_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(relid) DESC
  `.execute(db.db)

  return tableSizes.rows.map((r) => ({
    tableName: r.table_name,
    sizeInBytes: r.size_bytes,
  }))
}
