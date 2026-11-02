import type { ChainRecord } from '@l2beat/database'
import { getBlockNumberAtOrBefore } from '@l2beat/shared'
import { toBatches, UnixTime } from '@l2beat/shared-pure'
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
// A chain's calls go out this many at a time, so its RPC sees a few requests
// at once instead of all of them.
const CALLS_PER_CHUNK = 200

const erc4626Abi = parseAbi([
  'function asset() view returns (address)',
  'function totalAssets() view returns (uint256)',
])

// Reads each call on its own and leaves batching to viem: concurrent calls go
// out as Multicall3 aggregates where Multicall3 is deployed, and as JSON-RPC
// batches where it is not. A failed aggregate fails every call in it, and
// inside an aggregate an RPC failure looks like a revert, so a call that fails
// there is read once more outside Multicall3. Only failures that are not the
// contract's own are reported. Vault probes never fail: most tokens are not
// vaults.
export class ViemChainReader implements ChainReader {
  private readonly chains: Map<string, ChainRecord>

  constructor(chains: ChainRecord[]) {
    this.chains = new Map(chains.map((chain) => [chain.name, chain]))
  }

  async read(
    chain: string,
    calls: ChainCall[],
    warnings: string[],
    before?: UnixTime,
  ): Promise<ChainCallResult[]> {
    const { client, retryClient } = await this.connect(chain)
    const blockNumber =
      before === undefined
        ? undefined
        : await getBlockBefore(retryClient, before)
    let failed = 0
    const read = async (call: ChainCall): Promise<ChainCallResult> => {
      try {
        return await readCall(client, call, blockNumber)
      } catch (error) {
        // Without Multicall3 the first read went through `retryClient`, so its
        // error already tells a revert from an RPC failure.
        if (client === retryClient) {
          if (!isContractFailure(error)) failed++
          return undefined
        }
      }
      try {
        return await readCall(retryClient, call, blockNumber)
      } catch (error) {
        if (!isContractFailure(error)) failed++
        return undefined
      }
    }
    const results: ChainCallResult[] = []
    for (const chunk of toBatches(calls, CALLS_PER_CHUNK)) {
      results.push(...(await Promise.all(chunk.map(read))))
    }
    if (failed > 0) {
      const at = blockNumber === undefined ? '' : ` at block ${blockNumber}`
      warnings.push(
        `Reading ${chain}${at}: ${failed} of ${calls.length} calls failed`,
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

    // Also fails the whole chain early when its RPC is unreachable.
    const multicallCode = await createPublicClient({
      transport: http(rpc.url, { timeout: RPC_TIMEOUT_MS, retryCount: 1 }),
    })
      .getCode({ address: MULTICALL3 })
      .catch((error: unknown) => {
        throw rpcError(error)
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

// The last block before `timestamp`, so its state has everything earlier
// and nothing from `timestamp` on.
async function getBlockBefore(
  client: PublicClient,
  timestamp: UnixTime,
): Promise<bigint> {
  try {
    const latest = await client.getBlockNumber()
    const block = await getBlockNumberAtOrBefore(
      UnixTime(timestamp - 1),
      0,
      Number(latest),
      async (blockNumber) => {
        const block = await client.getBlock({
          blockNumber: BigInt(blockNumber),
        })
        return { timestamp: Number(block.timestamp) }
      },
    )
    return BigInt(block)
  } catch (error) {
    throw rpcError(error)
  }
}

// viem's message includes the RPC URL, which can carry an API key.
function rpcError(error: unknown): Error {
  return new Error('RPC request failed', {
    cause: error instanceof BaseError ? error.shortMessage : undefined,
  })
}

// Rejects when the call fails, except a vault probe, which yields undefined
// for a token that is not a vault.
function readCall(
  client: PublicClient,
  call: ChainCall,
  blockNumber: bigint | undefined,
): Promise<ChainCallResult> {
  const token = call.token as Address
  switch (call.type) {
    case 'totalSupply':
      return client.readContract({
        address: token,
        abi: erc20Abi,
        functionName: 'totalSupply',
        blockNumber,
      })
    case 'decimals':
      return client.readContract({
        address: token,
        abi: erc20Abi,
        functionName: 'decimals',
        blockNumber,
      })
    case 'balanceOf': {
      const holder = call.holder as Address
      return call.token === 'native'
        ? client.getBalance({ address: holder, blockNumber })
        : client.readContract({
            address: token,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [holder],
            blockNumber,
          })
    }
    case 'vaultAsset':
      return readVaultAsset(client, token, blockNumber)
  }
}

// An ERC-4626 vault answers both asset() and totalAssets().
async function readVaultAsset(
  client: PublicClient,
  vault: Address,
  blockNumber: bigint | undefined,
): Promise<VaultAsset | undefined> {
  const [asset, totalAssets] = await Promise.all([
    orUndefined(
      client.readContract({
        address: vault,
        abi: erc4626Abi,
        functionName: 'asset',
        blockNumber,
      }),
    ),
    orUndefined(
      client.readContract({
        address: vault,
        abi: erc4626Abi,
        functionName: 'totalAssets',
        blockNumber,
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
      blockNumber,
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
