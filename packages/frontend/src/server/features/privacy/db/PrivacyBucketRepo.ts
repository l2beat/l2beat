import { getPrivacyDb } from './PrivacyDb'

export interface PrivacyBucketRow {
  projectId: string
  assetKey: string
  bucketId: string
  timestamp: number
  totalValueAmount: string | null
  priceUsd: number | null
  totalValueUsd: number | null
  depositsTotal: number
  deposits7d: number
  deposits30d: number
}

interface Raw {
  project_id: string
  asset_key: string
  bucket_id: string
  timestamp: number
  total_value_amount: string | null
  price_usd: number | null
  total_value_usd: number | null
  deposits_total: number
  deposits_7d: number
  deposits_30d: number
}

const UPSERT_SQL = `
INSERT INTO privacy_bucket_snapshot (
  project_id, asset_key, bucket_id, timestamp,
  total_value_amount, price_usd, total_value_usd,
  deposits_total, deposits_7d, deposits_30d
) VALUES (
  @projectId, @assetKey, @bucketId, @timestamp,
  @totalValueAmount, @priceUsd, @totalValueUsd,
  @depositsTotal, @deposits7d, @deposits30d
)
ON CONFLICT(project_id, asset_key, bucket_id) DO UPDATE SET
  timestamp = excluded.timestamp,
  total_value_amount = excluded.total_value_amount,
  price_usd = excluded.price_usd,
  total_value_usd = excluded.total_value_usd,
  deposits_total = excluded.deposits_total,
  deposits_7d = excluded.deposits_7d,
  deposits_30d = excluded.deposits_30d
`

export function upsertManyPrivacyBucketRows(rows: PrivacyBucketRow[]): void {
  if (rows.length === 0) return
  const db = getPrivacyDb()
  const stmt = db.prepare(UPSERT_SQL)
  const tx = db.transaction((batch: PrivacyBucketRow[]) => {
    for (const row of batch) stmt.run(row)
  })
  tx(rows)
}

export function getAllPrivacyBucketRows(): PrivacyBucketRow[] {
  const db = getPrivacyDb()
  const rows = db
    .prepare(
      `SELECT project_id, asset_key, bucket_id, timestamp,
              total_value_amount, price_usd, total_value_usd,
              deposits_total, deposits_7d, deposits_30d
       FROM privacy_bucket_snapshot`,
    )
    .all() as Raw[]

  return rows.map((r) => ({
    projectId: r.project_id,
    assetKey: r.asset_key,
    bucketId: r.bucket_id,
    timestamp: r.timestamp,
    totalValueAmount: r.total_value_amount,
    priceUsd: r.price_usd,
    totalValueUsd: r.total_value_usd,
    depositsTotal: r.deposits_total,
    deposits7d: r.deposits_7d,
    deposits30d: r.deposits_30d,
  }))
}
