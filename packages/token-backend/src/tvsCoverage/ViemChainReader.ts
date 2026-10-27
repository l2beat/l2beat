import {
  type Address,
  createPublicClient,
  erc20Abi,
  http,
  type PublicClient,
  parseAbi,
  zeroAddress,
} from 'viem'
import {
  type ChainCall,
  type ChainCallResult,
  type ChainReader,
  MissingRpcError,
} from './estimateValues'

const MULTICALL3 = '0xcA11bde05977b3631167028862bE2a173976CA11'
const MULTICALL_CHUNK = 200
const FALLBACK_CONCURRENCY = 5

const erc4626Abi = parseAbi([
  'function asset() view returns (address)',
  'function totalAssets() view returns (uint256)',
])

type ContractCall = {
  address: Address
  abi: typeof erc20Abi | typeof erc4626Abi
  functionName: string
  args?: readonly unknown[]
}

export class ViemChainReader implements ChainReader {
  private readonly clients = new Map<string, PublicClient>()

  constructor(private readonly rpcUrls: Map<string, string>) {}

  async read(chain: string, calls: ChainCall[]): Promise<ChainCallResult[]> {
    if (calls.length === 0) return []
    const client = this.getClient(chain)
    if (!client) throw new MissingRpcError(chain)

    const contractCalls: { index: number; call: ContractCall }[] = []
    const nativeBalances: { index: number; holder: Address }[] = []
    calls.forEach((call, index) => {
      if (call.type === 'balanceOf' && call.token === 'native') {
        nativeBalances.push({ index, holder: call.holder as Address })
        return
      }
      for (const contractCall of toContractCalls(call)) {
        contractCalls.push({ index, call: contractCall })
      }
    })

    const [contractResults, balances] = await Promise.all([
      this.callContracts(
        client,
        contractCalls.map(({ call }) => call),
      ),
      mapConcurrent(nativeBalances, FALLBACK_CONCURRENCY, ({ holder }) =>
        client.getBalance({ address: holder }).catch(() => undefined),
      ),
    ])

    const results: ChainCallResult[] = calls.map(() => undefined)
    nativeBalances.forEach(({ index }, i) => {
      results[index] = balances[i]
    })

    // An ERC-4626 vault answers both asset() and totalAssets().
    const assets = new Map<number, Address>()
    const hasTotalAssets = new Set<number>()
    contractCalls.forEach(({ index, call }, i) => {
      const value = contractResults[i]
      if (calls[index]?.type !== 'vaultAsset') {
        results[index] =
          typeof value === 'bigint'
            ? value
            : typeof value === 'number'
              ? BigInt(value)
              : undefined
      } else if (call.functionName === 'asset') {
        if (typeof value === 'string' && value !== zeroAddress) {
          assets.set(index, value as Address)
        }
      } else if (typeof value === 'bigint') {
        hasTotalAssets.add(index)
      }
    })
    const confirmed = Array.from(assets).filter(([index]) =>
      hasTotalAssets.has(index),
    )
    const symbols = await this.callContracts(
      client,
      confirmed.map(([, asset]) => ({
        address: asset,
        abi: erc20Abi,
        functionName: 'symbol',
      })),
    )
    confirmed.forEach(([index, asset], i) => {
      const symbol = symbols[i]
      results[index] = {
        address: asset.toLowerCase(),
        symbol: typeof symbol === 'string' && symbol ? symbol : undefined,
      }
    })

    return results
  }

  private getClient(chain: string): PublicClient | undefined {
    const existing = this.clients.get(chain)
    if (existing) return existing
    const url = this.rpcUrls.get(chain)
    if (!url) return undefined
    const client = createPublicClient({
      transport: http(url, { retryCount: 1, timeout: 15_000 }),
    })
    this.clients.set(chain, client)
    return client
  }

  private async callContracts(
    client: PublicClient,
    calls: ContractCall[],
  ): Promise<unknown[]> {
    const results: unknown[] = []
    for (let i = 0; i < calls.length; i += MULTICALL_CHUNK) {
      const chunk = calls.slice(i, i + MULTICALL_CHUNK)
      results.push(...(await this.callChunk(client, chunk)))
    }
    return results
  }

  private async callChunk(
    client: PublicClient,
    calls: ContractCall[],
  ): Promise<unknown[]> {
    if (calls.length === 0) return []
    try {
      const results = await client.multicall({
        // biome-ignore lint/suspicious/noExplicitAny: mixed ABIs per call
        contracts: calls as any,
        allowFailure: true,
        multicallAddress: MULTICALL3,
      })
      return results.map((result) =>
        result.status === 'success' ? result.result : undefined,
      )
    } catch {
      // Chains without Multicall3 at the canonical address (e.g. ZK Stack)
      // fall back to one eth_call per read.
      return await mapConcurrent(calls, FALLBACK_CONCURRENCY, (call) =>
        client
          // biome-ignore lint/suspicious/noExplicitAny: mixed ABIs per call
          .readContract(call as any)
          .catch(() => undefined),
      )
    }
  }
}

function toContractCalls(call: ChainCall): ContractCall[] {
  const address = call.token as Address
  switch (call.type) {
    case 'totalSupply':
      return [{ address, abi: erc20Abi, functionName: 'totalSupply' }]
    case 'decimals':
      return [{ address, abi: erc20Abi, functionName: 'decimals' }]
    case 'balanceOf':
      return [
        {
          address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [call.holder as Address],
        },
      ]
    case 'vaultAsset':
      return [
        { address, abi: erc4626Abi, functionName: 'asset' },
        { address, abi: erc4626Abi, functionName: 'totalAssets' },
      ]
  }
}

async function mapConcurrent<T, R>(
  values: T[],
  concurrency: number,
  fn: (value: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(values.length)
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(concurrency, values.length) }, async () => {
      while (next < values.length) {
        const index = next++
        // biome-ignore lint/style/noNonNullAssertion: index is in range
        results[index] = await fn(values[index]!)
      }
    }),
  )
  return results
}
