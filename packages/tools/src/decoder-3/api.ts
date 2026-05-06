import type {
  TransactionQuery,
  TransactionResult,
} from '@l2beat/tools-api/types'

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://tools-api.l2beat.com'
    : 'http://localhost:3000'

export async function getTransaction(
  query: TransactionQuery,
): Promise<TransactionResult | null> {
  const res = await fetch(`${baseUrl}/api/tx`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  })
  const json = await res.json()
  return json as TransactionResult | null
}
