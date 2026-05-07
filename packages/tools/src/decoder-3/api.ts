import type {
  Chain,
  LookupQuery,
  LookupResult,
  TransactionQuery,
  TransactionResult,
} from '@l2beat/tools-api/types'

export { TransactionQuery, TransactionResult, LookupQuery, LookupResult, Chain }

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

export async function lookup(query: {
  selectors: `0x${string}`[]
  addresses: { chainId: number; address: `0x${string}` }[]
}) {
  const selectorQueries = query.selectors.map(
    (selector): LookupQuery => ({
      type: 'selector',
      selector,
    }),
  )
  const addressQueries = query.addresses.map(
    ({ chainId, address }): LookupQuery => ({
      type: 'address',
      chainId,
      address,
    }),
  )
  const queries: LookupQuery[] = [...selectorQueries, ...addressQueries]
  const res = await fetch(`${baseUrl}/api/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(queries),
  })
  const json = await res.json()
  return json as LookupResult[]
}

export async function getChains() {
  const res = await fetch(`${baseUrl}/api/chains`)
  const json = await res.json()
  return json as Chain[]
}
