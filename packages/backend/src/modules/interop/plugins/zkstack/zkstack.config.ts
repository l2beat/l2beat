/**
 * recipe
 * 1. get all deployed token addresses per supported chain (e.g. ethereum, zksync2, abstract)
 * 2. for each chain get assetIds for all tokens from (1) by calling assetId(tokenAddress)
 * 3. create a cross-chain set of assetIds and merge in the token addresses we already have from (1)
 * 4. fill in missing token addresses by calling tokenAddress(assetId) on each chain for missing entries
 * 5. fill in origin chain ids by calling originChainId(assetId) on L1 for all assetIds
 * 6. ...
 * 7. enjoy the mapping
 */
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

const MULTICALL_CHUNK = 150
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
    const chainDescriptors = [
      {
        chain: 'ethereum',
        contract: ChainSpecificAddress.address(ZKSTACK_L1_NATIVE_TOKEN_VAULT),
      },
      ...ZKSTACK_SUPPORTED.map((network) => ({
        chain: network.chain,
        contract: ChainSpecificAddress.address(network.l2SharedBridge),
      })),
    ]

    const ethChainName = chainDescriptors[0]
    const ethRpc = this.rpcs.get(ethChainName.chain)
    if (!ethRpc) {
      throw new Error(`Missing RPC client for ${ethChainName.chain}`)
    }

    const missingL2Networks = ZKSTACK_SUPPORTED.filter(
      (n) => !this.rpcs.has(n.chain),
    )
    if (missingL2Networks.length > 0) {
      const missingChains = missingL2Networks.map((n) => n.chain)
      this.logger
        .for('InteropExamples')
        .warn('Missing zkstack RPC clients for example configs', {
          missingChains,
          expectedChains: ZKSTACK_SUPPORTED.map((n) => n.chain),
          hint: 'Include a tx for each zk-assets-supported chain in your example.',
        })
    }

    const missingChains = chainDescriptors
      .filter((descriptor) => !this.rpcs.has(descriptor.chain))
      .map((descriptor) => descriptor.chain)
    if (missingChains.length > 0) {
      this.logger.warn('Missing RPC clients for zkstack chains', {
        chains: missingChains,
      })
    }

    const chainsWithRpcs = chainDescriptors.flatMap((descriptor) => {
      const rpc = this.rpcs.get(descriptor.chain)
      if (!rpc) return []
      return [{ ...descriptor, rpc }]
    })

    if (chainsWithRpcs.length < 2) {
      this.logger.warn(
        'Need at least two zkstack RPC clients available, skipping update',
      )
      return
    }

    const tokensByChain = await this.getTokenAddressesByChain(
      chainsWithRpcs.map((descriptor) => descriptor.chain),
    )

    const tokensByAssetIdByChain = new Map<
      string,
      Map<string, EthereumAddress>
    >()

    for (const { chain, contract, rpc } of chainsWithRpcs) {
      const tokens = tokensByChain.get(chain) ?? []
      if (tokens.length === 0) {
        this.logger.warn('No tokens found in token database', { chain })
      }

      const assetIdsByToken =
        tokens.length > 0
          ? await this.fetchAssetIds(rpc, contract, tokens, chain)
          : new Map<EthereumAddress, `0x${string}`>()

      const tokensByAssetId = new Map<string, EthereumAddress>()
      for (const [token, assetId] of assetIdsByToken.entries()) {
        tokensByAssetId.set(assetId, token)
      }
      tokensByAssetIdByChain.set(chain, tokensByAssetId)
    }

    const assetIdSet = new Set<string>()
    for (const tokensByAssetId of tokensByAssetIdByChain.values()) {
      for (const assetId of tokensByAssetId.keys()) {
        assetIdSet.add(assetId)
      }
    }

    if (assetIdSet.size === 0) {
      this.logger.warn(
        'No assetIds resolved from available chains, skipping update',
      )
      return
    }

    const assetIds = [...assetIdSet]
    const originChainIds = await this.fetchOriginChainIds(
      ethRpc,
      ethChainName.contract,
      assetIds,
    )

    for (const { chain, contract, rpc } of chainsWithRpcs) {
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
          tokensByAssetId.set(assetId, token)
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

      for (const { chain } of chainsWithRpcs) {
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
