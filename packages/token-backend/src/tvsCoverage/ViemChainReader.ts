import type { ChainRecord } from '@l2beat/database'
import {
  type Address,
  BaseError,
  ContractFunctionRevertedError,
  ContractFunctionZeroDataError,
  createPublicClient,
  defineChain,
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
  type VaultAsset,
} from './estimateValues'

const MULTICALL3: Address = '0xcA11bde05977b3631167028862bE2a173976CA11'
const MULTICALL_BATCH_BYTES = 4_096
const RPC_BATCH_SIZE = 100
const RPC_TIMEOUT_MS = 15_000

const erc4626Abi = parseAbi([
  'function asset() view returns (address)',
  'function totalAssets() view returns (uint256)',
])

// Reads each call on its own and leaves batching to viem: concurrent calls go
// out as Multicall3 aggregates where Multicall3 is deployed, and as JSON-RPC
// batches where it is not. A failed aggregate or batch fails every call in it,
// and inside an aggregate an RPC failure looks like a revert, so a failed call
// is read once more outside Multicall3. Only failures that are not the
// contract's own are reported. Vault probes are not retried: most tokens are
// not vaults.
export class ViemChainReader implements ChainReader {
  private readonly chains: Map<string, ChainRecord>

  constructor(chains: ChainRecord[]) {
    this.chains = new Map(chains.map((chain) => [chain.name, chain]))
  }

  async read(
    chain: string,
    calls: ChainCall[],
    warnings: string[],
  ): Promise<ChainCallResult[]> {
    const { client, retryClient } = await this.connect(chain)
    const firstResults = await Promise.all(
      calls.map((call) => readCall(client, call).catch(() => undefined)),
    )
    let failed = 0
    const results = await Promise.all(
      calls.map(async (call, i) => {
        if (firstResults[i] !== undefined || call.type === 'vaultAsset') {
          return firstResults[i]
        }
        try {
          return await readCall(retryClient, call)
        } catch (error) {
          if (!isContractFailure(error)) failed++
          return undefined
        }
      }),
    )
    if (failed > 0) {
      warnings.push(
        `Reading ${chain}: ${failed} of ${calls.length} calls failed`,
      )
    }
    return results
  }

  private async connect(
    name: string,
  ): Promise<{ client: PublicClient; retryClient: PublicClient }> {
    const chain = this.chains.get(name)
    const rpc = chain?.apis?.find((api) => api.type === 'rpc')
    if (!chain || !rpc) throw new MissingRpcError(name)

    // Also fails the whole chain early when its RPC is unreachable. viem's
    // message includes the RPC URL, which can carry an API key.
    const multicallCode = await createPublicClient({
      transport: http(rpc.url, { timeout: RPC_TIMEOUT_MS, retryCount: 1 }),
    })
      .getCode({ address: MULTICALL3 })
      .catch((error: unknown) => {
        throw new Error('RPC request failed', {
          cause: error instanceof BaseError ? error.shortMessage : undefined,
        })
      })
    const hasMulticall3 = multicallCode !== undefined

    const definition = defineChain({
      id: chain.chainId,
      name: chain.name,
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: { default: { http: [rpc.url] } },
      contracts: hasMulticall3
        ? { multicall3: { address: MULTICALL3 } }
        : undefined,
    })
    const retryClient = createPublicClient({
      chain: definition,
      transport: http(rpc.url, {
        timeout: RPC_TIMEOUT_MS,
        retryCount: 1,
        batch: { batchSize: RPC_BATCH_SIZE },
      }),
    })
    if (!hasMulticall3) return { client: retryClient, retryClient }
    const client = createPublicClient({
      chain: definition,
      transport: http(rpc.url, { timeout: RPC_TIMEOUT_MS, retryCount: 1 }),
      batch: { multicall: { batchSize: MULTICALL_BATCH_BYTES } },
    })
    return { client, retryClient }
  }
}

// Rejects when the call fails, except a vault probe, which yields undefined
// for a token that is not a vault.
function readCall(
  client: PublicClient,
  call: ChainCall,
): Promise<ChainCallResult> {
  const token = call.token as Address
  switch (call.type) {
    case 'totalSupply':
      return client.readContract({
        address: token,
        abi: erc20Abi,
        functionName: 'totalSupply',
      })
    case 'decimals':
      return client.readContract({
        address: token,
        abi: erc20Abi,
        functionName: 'decimals',
      })
    case 'balanceOf': {
      const holder = call.holder as Address
      return call.token === 'native'
        ? client.getBalance({ address: holder })
        : client.readContract({
            address: token,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [holder],
          })
    }
    case 'vaultAsset':
      return readVaultAsset(client, token)
  }
}

// An ERC-4626 vault answers both asset() and totalAssets().
async function readVaultAsset(
  client: PublicClient,
  vault: Address,
): Promise<VaultAsset | undefined> {
  const [asset, totalAssets] = await Promise.all([
    orUndefined(
      client.readContract({
        address: vault,
        abi: erc4626Abi,
        functionName: 'asset',
      }),
    ),
    orUndefined(
      client.readContract({
        address: vault,
        abi: erc4626Abi,
        functionName: 'totalAssets',
      }),
    ),
  ])
  if (!asset || asset === zeroAddress || totalAssets === undefined) {
    return undefined
  }
  const symbol = await orUndefined(
    client.readContract({
      address: asset,
      abi: erc20Abi,
      functionName: 'symbol',
    }),
  )
  return { address: asset.toLowerCase(), symbol: symbol || undefined }
}

function orUndefined<T>(promise: Promise<T>): Promise<T | undefined> {
  return promise.catch(() => undefined)
}

// The contract does not answer the call: it reverts, or there is no contract.
function isContractFailure(error: unknown): boolean {
  return (
    error instanceof BaseError &&
    error.walk(
      (cause) =>
        cause instanceof ContractFunctionRevertedError ||
        cause instanceof ContractFunctionZeroDataError,
    ) !== null
  )
}
