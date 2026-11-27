import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import {
  balanceOfCall,
  decodeTryAggregate,
  encodeTryAggregate,
  getEthBalanceCall,
  MULTICALL3_ADDRESS,
} from './balanceMulticall'

export const NATIVE_TOKEN = 'native'

// About 30k gas per `balanceOf` keeps a batch near 15M gas, well below the
// default `eth_call` gas cap of 50M.
const MULTICALL_BATCH_SIZE = 500
// The holder index answers in under 300 ms (p99) and a batch of 500
// `balanceOf` calls in under 100 ms, but `eth_call` queues behind the RPC's
// shared provider rate limit, which took p99 to 1.8 s at 46 checks/s.
const REQUEST_TIMEOUT_MS = 15_000
// The holder index's error code for an incomplete or disabled index.
const INDEX_NOT_READY_CODE = -32001

export class HolderIndexNotReadyError extends Error {
  override name = 'HolderIndexNotReadyError'
}

const JsonRpcResponse = v.object({
  result: v.unknown().optional(),
  error: v.object({ code: v.number(), message: v.string() }).optional(),
})
const Address = v.string().check((value) => /^0x[0-9a-fA-F]{40}$/.test(value))
const HeldTokensResult = v.object({
  tokens: v.array(v.object({ address: Address })),
})
const Quantity = v.string().check((value) => /^0x[0-9a-f]+$/i.test(value))

/**
 * The calls Insight makes to ETHBEAT's Ethereum RPC, which serves the holder
 * index. One fetch per call, no retries: a report is rebuilt on the next
 * request, and the holder index says retrying is safe.
 */
export class EthereumHolderRpc {
  constructor(private readonly url: string) {}

  /**
   * Lowercase addresses of every token the holder sent or received. A set of
   * candidates, not of balances: see `HELD_TOKENS.md` of the RPC.
   */
  async getHeldTokens(holder: string): Promise<string[]> {
    try {
      const result = HeldTokensResult.parse(
        await this.request('ethbeat_heldTokens', [holder]),
      )
      // Lowercased anyway: token-db keys are lowercase, and a checksummed
      // address would otherwise count as untracked.
      return result.tokens.map((token) => token.address.toLowerCase())
    } catch (error) {
      if (isIndexNotReady(error)) {
        throw new HolderIndexNotReadyError('Holder index not ready', {
          cause: error,
        })
      }
      throw error
    }
  }

  async getBlockNumber(): Promise<number> {
    const result = Quantity.parse(await this.request('eth_blockNumber', []))
    return Number(BigInt(result))
  }

  /**
   * Balance of each token at one block, through Multicall3 so a few hundred
   * tokens cost a few `eth_call`s. `NATIVE_TOKEN` reads the ETH balance.
   * Undefined for a token whose call reverted or did not return one word,
   * e.g. an address that is not a contract.
   */
  async getBalances(
    holder: string,
    tokens: string[],
    blockNumber: number,
  ): Promise<(bigint | undefined)[]> {
    const calls = tokens.map((token) =>
      token === NATIVE_TOKEN
        ? getEthBalanceCall(holder)
        : balanceOfCall(token, holder),
    )
    const block = `0x${blockNumber.toString(16)}`
    const batches: (typeof calls)[] = []
    for (let i = 0; i < calls.length; i += MULTICALL_BATCH_SIZE) {
      batches.push(calls.slice(i, i + MULTICALL_BATCH_SIZE))
    }
    const results = await Promise.all(
      batches.map(async (batch) => {
        const result = Quantity.parse(
          await this.request('eth_call', [
            { to: MULTICALL3_ADDRESS, data: encodeTryAggregate(batch) },
            block,
          ]),
        )
        return decodeTryAggregate(result, batch.length)
      }),
    )
    const balances = results.flat()
    assert(balances.length === tokens.length, 'One balance per token')
    return balances
  }

  private async request(method: string, params: unknown[]): Promise<unknown> {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    if (!response.ok) {
      throw new Error('Insight RPC HTTP error', {
        cause: { method, status: response.status },
      })
    }
    const body = JsonRpcResponse.parse(await response.json())
    if (body.error) {
      throw new Error('Insight RPC error', {
        cause: { method, code: body.error.code, message: body.error.message },
      })
    }
    return body.result
  }
}

function isIndexNotReady(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const cause = error.cause
  if (typeof cause !== 'object' || cause === null) return false
  return 'code' in cause && cause.code === INDEX_NOT_READY_CODE
}
