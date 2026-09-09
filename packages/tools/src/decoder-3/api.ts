import type {
  AddressResult,
  Chain,
  LookupQuery,
  PreimageResult,
  SignatureResult,
  TransactionQuery,
  TransactionResult,
} from '@l2beat/tools-api/types'

export {
  TransactionQuery,
  TransactionResult,
  LookupQuery,
  SignatureResult,
  Chain,
}

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://tools-api.l2beat.com'
    : 'http://localhost:3000'

export async function getSafeState(
  chainId: number,
  address: `0x${string}`,
): Promise<{
  nonce: string
  version: string
  blockNumber: string
}> {
  const res = await fetch(`${baseUrl}/api/safe-state`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chainId, address: address.toLowerCase() }),
    signal: AbortSignal.timeout(40_000),
  })
  if (!res.ok)
    throw new Error('Could not read Safe version and nonce from RPC.')
  return await res.json()
}

export async function lookupTx(
  query: TransactionQuery,
): Promise<TransactionResult | null> {
  const res = await fetch(`${baseUrl}/api/lookup-tx`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  })
  const json = await res.json()
  return json as TransactionResult | null
}

export async function lookupSignatures(selectors: `0x${string}`[]) {
  selectors = selectors.filter((x) => /0x[\da-f]{8}/.test(x))
  if (selectors.length === 0) return []
  return await retry(async () => {
    const res = await fetch(`${baseUrl}/api/lookup-signatures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectors),
    })
    const json = await res.json()
    return json as SignatureResult[]
  })
}

export async function lookupAddress(chainId: number, address: `0x${string}`) {
  return await retry(async () => {
    const res = await fetch(`${baseUrl}/api/lookup-address`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chainId: Number(chainId),
        address: address as `0x${string}`,
      }),
    })
    const json = await res.json()
    return json as AddressResult
  })
}

export async function lookupPreimages(hashes: `0x${string}`[]) {
  hashes = hashes.filter((x) => /0x[\da-f]{64}/.test(x))
  if (hashes.length === 0) return []
  return await retry(async () => {
    const res = await fetch(`${baseUrl}/api/lookup-preimages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hashes),
    })
    const json = await res.json()
    return json as PreimageResult[]
  })
}

export async function getChains() {
  const res = await fetch(`${baseUrl}/api/chains`)
  const json = await res.json()
  return json as Chain[]
}

export async function retry<T>(fn: () => Promise<T>) {
  let timeout = 100
  while (true) {
    try {
      return await fn()
    } catch {
      await new Promise((r) => setTimeout(r, timeout))
      timeout *= 2
    }
  }
}
