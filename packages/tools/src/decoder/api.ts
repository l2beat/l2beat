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
  PreimageResult,
  Chain,
}

export type AddressAlias = NonNullable<AddressResult['alias']>
export type TokenInfo = NonNullable<AddressResult['token']>

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
  if (!res.ok) {
    throw new Error('HTTP error', { cause: { status: res.status } })
  }
  const json = await res.json()
  return json as TransactionResult | null
}

export async function lookupSignatures(selectors: `0x${string}`[]) {
  selectors = selectors.filter((x) => /0x[\da-f]{8}/.test(x))
  if (selectors.length === 0) return []
  return await postJson<SignatureResult[]>('/api/lookup-signatures', selectors)
}

export async function lookupAddress(chainId: number, address: `0x${string}`) {
  return await postJson<AddressResult>('/api/lookup-address', {
    chainId: Number(chainId),
    address: address as `0x${string}`,
  })
}

export async function lookupPreimages(hashes: `0x${string}`[]) {
  hashes = hashes.filter((x) => /0x[\da-f]{64}/.test(x))
  if (hashes.length === 0) return []
  return await postJson<PreimageResult[]>('/api/lookup-preimages', hashes)
}

export async function getChains() {
  const res = await fetch(`${baseUrl}/api/chains`)
  const json = await res.json()
  return json as Chain[]
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  return await retry(async () => {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      throw new Error('HTTP error', { cause: { status: res.status } })
    }
    return (await res.json()) as T
  })
}

const ATTEMPT_COUNT_MAX = 4
const DELAY_MS_INITIAL = 100
const DELAY_MS_MAX = 2_000

// Bounded, so that an API that stays down ends in an error the page can show
// instead of a wait that doubles forever.
export async function retry<T>(fn: () => Promise<T>): Promise<T> {
  let delayMs = DELAY_MS_INITIAL
  for (let attempt = 1; attempt < ATTEMPT_COUNT_MAX; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (!isRetryable(error)) throw error
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs))
    delayMs = Math.min(delayMs * 2, DELAY_MS_MAX)
  }
  return await fn()
}

// A 4xx or a malformed body fails the same way on every attempt, except a
// request timeout (408) and a rate limit (429), which clear on their own.
function isRetryable(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const status = httpStatus(error)
  if (status !== undefined) {
    return status >= 500 || status === 408 || status === 429
  }
  // fetch rejects with a TypeError when the request never got a response.
  return error instanceof TypeError
}

function httpStatus(error: Error): number | undefined {
  const cause = error.cause
  if (typeof cause !== 'object' || cause === null) return undefined
  if (!('status' in cause)) return undefined
  return typeof cause.status === 'number' ? cause.status : undefined
}
