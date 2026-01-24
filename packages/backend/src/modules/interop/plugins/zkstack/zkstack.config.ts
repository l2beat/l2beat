import type { Logger } from '@l2beat/backend-tools'
import type { CallParameters, IRpcClient } from '@l2beat/shared'
import {
  Address32,
  Bytes,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
import { isEqual } from 'earl'
import {
  decodeFunctionResult,
  encodeFunctionData,
  type Hex,
  parseAbi,
} from 'viem'
import { TimeLoop } from '../../../../tools/TimeLoop'
import {
  defineConfig,
  type InteropConfigPlugin,
  type InteropConfigStore,
} from '../../engine/config/InteropConfigStore'
import {
  ZKSTACK_L1_NATIVE_TOKEN_VAULT,
  ZKSTACK_SUPPORTED,
} from './zkstack.networks'

export interface ZkStackAssetMappingEntry {
  chainId: number
  implementationAddresses: Record<string, Address32>
}

export type ZkStackAssetMapping = Record<string, ZkStackAssetMappingEntry>

export const ZkStackAssetsConfig =
  defineConfig<ZkStackAssetMapping>('zkstack-assets')

const ASSET_ABI = parseAbi([
  'function assetId(address tokenAddress) view returns (bytes32)',
  'function originChainId(bytes32 assetId) view returns (uint256)',
  'function tokenAddress(bytes32 assetId) view returns (address)',
])

const L1_CHAIN = 'ethereum'
const MULTICALL_CHUNK = 400
const ZERO_ASSET_ID = `0x${'0'.repeat(64)}` as const

export class ZkStackConfigPlugin
  extends TimeLoop
  implements InteropConfigPlugin
{
  provides = [ZkStackAssetsConfig]

  constructor(
    private store: InteropConfigStore,
    protected logger: Logger,
    private rpcs: Map<string, IRpcClient>,
    private tokenDbClient: TokenDbClient,
  ) {
    super({ intervalMs: 20 * 60 * 1000 })
    this.logger = logger.for(this).tag({ tag: ZkStackAssetsConfig.key })
  }

  async run() {
    try {
      const latest = await this.getLatestAssets()
      if (!latest) {
        return
      }
      const previous = this.store.get(ZkStackAssetsConfig)
      if (!previous || !isEqual(previous, latest)) {
        this.logger.info('Assets updated', { plugin: ZkStackAssetsConfig.key })
        this.store.set(ZkStackAssetsConfig, latest)
      }
    } catch (error) {
      this.logger.error('Failed to update assets', { error })
    }
  }

  private async getLatestAssets(): Promise<ZkStackAssetMapping | undefined> {
    const l1Rpc = this.rpcs.get(L1_CHAIN)
    if (!l1Rpc) {
      throw new Error(`Missing RPC client for ${L1_CHAIN}`)
    }

    const l2Networks = ZKSTACK_SUPPORTED.filter((n) => this.rpcs.has(n.chain))
    const missingNetworks = ZKSTACK_SUPPORTED.filter(
      (n) => !this.rpcs.has(n.chain),
    )
    if (missingNetworks.length > 0) {
      const missingChains = missingNetworks.map((n) => n.chain)
      this.logger.warn('Missing RPC clients for zkstack chains', {
        chains: missingChains,
      })
      this.logger
        .for('InteropExamples')
        .warn('Missing zkstack RPC clients for example configs', {
          missingChains,
          expectedChains: ZKSTACK_SUPPORTED.map((n) => n.chain),
          hint: 'Include a tx for each supported chain when running examples.',
        })
    }

    if (l2Networks.length === 0) {
      this.logger.warn('No zkstack L2 RPC clients available, skipping update')
      return
    }

    const l1Vault = ChainSpecificAddress.address(ZKSTACK_L1_NATIVE_TOKEN_VAULT)

    const chainsToFetch = [L1_CHAIN, ...l2Networks.map((n) => n.chain)]
    const contractsByChainEntries: Array<[string, EthereumAddress]> = [
      [L1_CHAIN, l1Vault],
      ...l2Networks.map(
        (network): [string, EthereumAddress] => [
          network.chain,
          ChainSpecificAddress.address(network.l2SharedBridge),
        ],
      ),
    ]
    const contractsByChain = new Map<string, EthereumAddress>(
      contractsByChainEntries,
    )
    const tokensByChain = await this.getTokenAddressesByChain(chainsToFetch)

    const tokensByAssetIdByChain = new Map<
      string,
      Map<string, EthereumAddress>
    >()

    for (const chain of chainsToFetch) {
      const rpc = this.rpcs.get(chain)
      if (!rpc) continue

      const tokens = tokensByChain.get(chain) ?? []
      if (tokens.length === 0) {
        this.logger.warn('No tokens found in token database', { chain })
      }

      const contract = contractsByChain.get(chain)
      if (!contract) continue
      const assetIdsByToken =
        tokens.length > 0
          ? await this.fetchAssetIds(rpc, contract, tokens, chain)
          : new Map<EthereumAddress, `0x${string}`>()

      tokensByAssetIdByChain.set(
        chain,
        this.buildTokensByAssetId(chain, assetIdsByToken),
      )
    }

    const assetIdSet = new Set<string>()
    for (const tokensByAssetId of tokensByAssetIdByChain.values()) {
      for (const assetId of tokensByAssetId.keys()) {
        assetIdSet.add(assetId)
      }
    }

    if (assetIdSet.size === 0) {
      this.logger.warn('No assetIds resolved from L1 or L2, skipping update')
      return
    }

    const assetIds = [...assetIdSet]
    const originChainIds = await this.fetchOriginChainIds(
      l1Rpc,
      l1Vault,
      assetIds,
    )

    for (const chain of chainsToFetch) {
      const rpc = this.rpcs.get(chain)
      if (!rpc) continue

      const contract = contractsByChain.get(chain)
      if (!contract) continue
      const tokensByAssetId =
        tokensByAssetIdByChain.get(chain) ?? new Map<string, EthereumAddress>()
      const missing = assetIds.filter((assetId) => {
        return !tokensByAssetId.has(assetId)
      })
      if (missing.length > 0) {
        const filled = await this.fetchTokenAddressesByAssetId(
          rpc,
          contract,
          missing,
          chain,
        )
        for (const [assetId, token] of filled) {
          this.setTokenForAssetId(chain, tokensByAssetId, assetId, token)
        }
      }
      tokensByAssetIdByChain.set(chain, tokensByAssetId)
    }

    const mappings: ZkStackAssetMapping = {}
    let skippedInsufficient = 0
    let missingOrigin = 0

    const orderedAssetIds = [...assetIds].sort((a, b) => a.localeCompare(b))
    for (const assetId of orderedAssetIds) {
      const implementationAddresses: Record<string, Address32> = {}
      let resolvedCount = 0

      for (const chain of chainsToFetch) {
        const token = tokensByAssetIdByChain.get(chain)?.get(assetId)
        if (!token || token === EthereumAddress.ZERO) continue
        implementationAddresses[chain] = Address32.from(token)
        resolvedCount++
      }

      if (resolvedCount < 2) {
        skippedInsufficient++
        continue
      }

      const chainId = originChainIds.get(assetId) ?? 0
      if (chainId === 0) {
        missingOrigin++
      }

      mappings[assetId] = {
        chainId,
        implementationAddresses,
      }
    }

    if (skippedInsufficient > 0) {
      this.logger.warn('Discarded assetIds with insufficient addresses', {
        skipped: skippedInsufficient,
      })
    }
    if (missingOrigin > 0) {
      this.logger.warn('Mappings missing origin chain id', {
        count: missingOrigin,
      })
    }

    return mappings
  }

  private async getTokenAddressesByChain(
    chains: string[],
  ): Promise<Map<string, EthereumAddress[]>> {
    const { abstractTokens, deployedWithoutAbstractTokens } =
      await this.tokenDbClient.abstractTokens.getAllWithDeployedTokens.query()

    const deployed = [
      ...deployedWithoutAbstractTokens,
      ...abstractTokens.flatMap((token) => token.deployedTokens),
    ]

    const chainSet = new Set(chains)
    const uniqueByChain = new Map<string, Map<string, EthereumAddress>>()
    for (const chain of chains) {
      uniqueByChain.set(chain, new Map())
    }

    for (const token of deployed) {
      if (!chainSet.has(token.chain)) continue
      if (!token.address.startsWith('0x') || token.address.length !== 42)
        continue

      const chainMap = uniqueByChain.get(token.chain)
      if (!chainMap) continue
      chainMap.set(token.address.toLowerCase(), EthereumAddress(token.address))
    }

    const result = new Map<string, EthereumAddress[]>()
    for (const [chain, tokens] of uniqueByChain.entries()) {
      result.set(chain, [...tokens.values()])
    }
    return result
  }

  private buildTokensByAssetId(
    chain: string,
    assetIdsByToken: Map<EthereumAddress, `0x${string}`>,
  ): Map<string, EthereumAddress> {
    const tokensByAssetId = new Map<string, EthereumAddress>()
    for (const [token, assetId] of assetIdsByToken.entries()) {
      this.setTokenForAssetId(chain, tokensByAssetId, assetId, token)
    }
    return tokensByAssetId
  }

  private setTokenForAssetId(
    chain: string,
    tokensByAssetId: Map<string, EthereumAddress>,
    assetId: string,
    token: EthereumAddress,
  ) {
    const existing = tokensByAssetId.get(assetId)
    if (existing && existing !== token) {
      this.logger.warn('Duplicate assetId mapping detected', {
        chain,
        assetId,
        previous: existing.toString(),
        next: token.toString(),
      })
    }
    tokensByAssetId.set(assetId, token)
  }

  private async fetchAssetIds(
    rpc: IRpcClient,
    contract: EthereumAddress,
    tokens: EthereumAddress[],
    chain: string,
  ): Promise<Map<EthereumAddress, `0x${string}`>> {
    const calls: CallParameters[] = tokens.map((token) => ({
      to: contract,
      data: Bytes.fromHex(
        encodeFunctionData({
          abi: ASSET_ABI,
          functionName: 'assetId',
          args: [token as `0x${string}`],
        }),
      ),
    }))

    const latest = await rpc.getLatestBlockNumber()
    const results = await this.multicallInChunks(rpc, calls, latest)

    const assetIds = new Map<EthereumAddress, `0x${string}`>()
    let failed = 0
    let zero = 0

    for (const [i, result] of results.entries()) {
      if (!result.success || result.data.toString() === '0x') {
        failed++
        continue
      }

      const assetId = decodeFunctionResult({
        abi: ASSET_ABI,
        functionName: 'assetId',
        data: result.data.toString() as Hex,
      }) as `0x${string}`

      const normalized = assetId.toLowerCase() as `0x${string}`
      if (normalized === ZERO_ASSET_ID) {
        zero++
        continue
      }

      assetIds.set(tokens[i], normalized)
    }

    this.logger.info('Resolved assetIds', {
      chain,
      total: tokens.length,
      resolved: assetIds.size,
      failed,
      zero,
    })

    return assetIds
  }

  private async fetchOriginChainIds(
    rpc: IRpcClient,
    l1Vault: EthereumAddress,
    assetIds: string[],
  ): Promise<Map<string, number>> {
    const originChainIds = new Map<string, number>()
    let failed = 0

    const calls: CallParameters[] = assetIds.map((assetId) => ({
      to: l1Vault,
      data: Bytes.fromHex(
        encodeFunctionData({
          abi: ASSET_ABI,
          functionName: 'originChainId',
          args: [assetId as `0x${string}`],
        }),
      ),
    }))

    const latest = await rpc.getLatestBlockNumber()
    const results = await this.multicallInChunks(rpc, calls, latest)

    for (const [i, result] of results.entries()) {
      if (!result.success || result.data.toString() === '0x') {
        failed++
        continue
      }

      const originChainId = decodeFunctionResult({
        abi: ASSET_ABI,
        functionName: 'originChainId',
        data: result.data.toString() as Hex,
      }) as bigint

      if (originChainId === 0n) continue
      originChainIds.set(assetIds[i], Number(originChainId))
    }

    this.logger.info('Resolved origin chain ids', {
      total: assetIds.length,
      resolved: originChainIds.size,
      failed,
    })

    return originChainIds
  }

  private async fetchTokenAddressesByAssetId(
    rpc: IRpcClient,
    contract: EthereumAddress,
    assetIds: string[],
    chain: string,
  ): Promise<Map<string, EthereumAddress>> {
    const calls: CallParameters[] = assetIds.map((assetId) => ({
      to: contract,
      data: Bytes.fromHex(
        encodeFunctionData({
          abi: ASSET_ABI,
          functionName: 'tokenAddress',
          args: [assetId as `0x${string}`],
        }),
      ),
    }))

    const latest = await rpc.getLatestBlockNumber()
    const results = await this.multicallInChunks(rpc, calls, latest)

    const tokensByAssetId = new Map<string, EthereumAddress>()
    let failed = 0

    for (const [i, result] of results.entries()) {
      if (!result.success || result.data.toString() === '0x') {
        failed++
        continue
      }

      const token = decodeFunctionResult({
        abi: ASSET_ABI,
        functionName: 'tokenAddress',
        data: result.data.toString() as Hex,
      }) as `0x${string}`

      tokensByAssetId.set(assetIds[i], EthereumAddress(token))
    }

    this.logger.info('Resolved tokenAddress by assetId', {
      chain,
      total: assetIds.length,
      resolved: tokensByAssetId.size,
      failed,
    })

    return tokensByAssetId
  }

  private async multicallInChunks(
    rpc: IRpcClient,
    calls: CallParameters[],
    blockNumber: number,
  ) {
    const results = []
    for (let i = 0; i < calls.length; i += MULTICALL_CHUNK) {
      const chunk = calls.slice(i, i + MULTICALL_CHUNK)
      const chunkResults = await rpc.multicall(chunk, blockNumber)
      results.push(...chunkResults)
    }
    return results
  }
}
