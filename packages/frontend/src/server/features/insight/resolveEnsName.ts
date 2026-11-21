import {
  decodeEnsAddrResult,
  ENS_UNIVERSAL_RESOLVER,
  encodeEnsAddrCall,
  isEnsNotResolvedRevert,
  parseEnsName,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

const ENS_TIMEOUT_MS = 15_000

const HexData = v.string().check((value) => /^0x([0-9a-f]{2})*$/i.test(value))
const EthCallResponse = v.object({
  result: v.unknown().optional(),
  error: v
    .object({
      code: v.number(),
      message: v.string(),
      data: v.unknown().optional(),
    })
    .optional(),
})

export type EnsResolution =
  | { status: 'resolved'; name: string; address: string }
  | { status: 'invalidName' }
  | { status: 'notResolved' }

type EthCallOutcome =
  | { type: 'returned'; data: string }
  | { type: 'reverted'; data: string }

/**
 * The address an ENS name points to on Ethereum, through the Universal
 * Resolver on our own RPC.
 *
 * CCIP-read is never followed: the resolver contract picks the gateway URL,
 * so anyone could register a name that makes our server fetch any URL. Names
 * served offchain (e.g. `cb.id`) therefore do not resolve.
 */
export async function resolveEnsName(
  rpcUrl: string,
  input: string,
): Promise<EnsResolution> {
  const ensName = parseEnsName(input)
  if (ensName === undefined) return { status: 'invalidName' }
  assert(ensName.name.length > 0, 'Normalized name must not be empty')

  const outcome = await callUniversalResolver(
    rpcUrl,
    encodeEnsAddrCall(ensName),
  )
  if (outcome.type === 'reverted') {
    if (isEnsNotResolvedRevert(outcome.data)) return { status: 'notResolved' }
    throw new Error('ENS resolve reverted', {
      cause: { name: ensName.name, revertData: outcome.data },
    })
  }

  const address = decodeEnsAddrResult(outcome.data)
  if (address === undefined) return { status: 'notResolved' }
  return { status: 'resolved', name: ensName.name, address }
}

/** One `eth_call` at the latest block, no retries. */
async function callUniversalResolver(
  rpcUrl: string,
  calldata: string,
): Promise<EthCallOutcome> {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_call',
      params: [{ to: ENS_UNIVERSAL_RESOLVER, data: calldata }, 'latest'],
    }),
    signal: AbortSignal.timeout(ENS_TIMEOUT_MS),
  })
  if (!response.ok) {
    throw new Error('ENS RPC HTTP error', {
      cause: { status: response.status },
    })
  }

  const body = EthCallResponse.parse(await response.json())
  if (body.error !== undefined) {
    // Nodes differ in the error code of a revert, but all put its data here.
    const revertData = HexData.safeParse(body.error.data)
    if (revertData.success) return { type: 'reverted', data: revertData.data }
    throw new Error('ENS RPC error', {
      cause: { code: body.error.code, message: body.error.message },
    })
  }
  return { type: 'returned', data: HexData.parse(body.result) }
}
