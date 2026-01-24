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
import { ZKSTACK_SUPPORTED } from './zkstack.networks'

export interface ZkStackAssetMapping {
  assetId: `0x${string}`
  originChainId: number
  l1TokenAddress: Address32
  l2TokenAddresses: Record<string, Address32>
}

export const ZkStackAssetsConfig =
  defineConfig<ZkStackAssetMapping[]>('zkstack-assets')

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

  private async getLatestAssets(): Promise<ZkStackAssetMapping[] | undefined> {
    const l1Rpc = this.rpcs.get(L1_CHAIN)
    if (!l1Rpc) {
      throw new Error(`Missing RPC client for ${L1_CHAIN}`)
    }

    const l2Networks = ZKSTACK_SUPPORTED.filter((n) => this.rpcs.has(n.chain))
    const missingNetworks = ZKSTACK_SUPPORTED.filter(
      (n) => !this.rpcs.has(n.chain),
    )
    if (missingNetworks.length > 0) {
      this.logger.warn('Missing RPC clients for zkstack chains', {
        chains: missingNetworks.map((n) => n.chain),
      })
    }

    if (l2Networks.length === 0) {
      this.logger.warn('No zkstack L2 RPC clients available, skipping update')
      return
    }

    const l1Vaults = [
      ...new Set(
        l2Networks.map((n) =>
          ChainSpecificAddress.address(n.l1NativeTokenVault),
        ),
      ),
    ]
    const primaryL1Vault = l1Vaults[0]
    if (!primaryL1Vault) {
      this.logger.warn('Missing L1 vault address, skipping update')
      return
    }

    const chainsToFetch = [L1_CHAIN, ...l2Networks.map((n) => n.chain)]
    const tokensByChain = await this.getTokenAddressesByChain(chainsToFetch)

    const l1Tokens = tokensByChain.get(L1_CHAIN) ?? []
    if (l1Tokens.length === 0) {
      this.logger.warn('No L1 tokens found in token database')
    }

    const l2TokensByChain = new Map<string, EthereumAddress[]>()
    for (const network of l2Networks) {
      const tokens = tokensByChain.get(network.chain) ?? []
      if (tokens.length === 0) {
        this.logger.warn('No L2 tokens found in token database', {
          chain: network.chain,
        })
      }
      l2TokensByChain.set(network.chain, tokens)
    }

    const l1AssetIdsByToken =
      l1Tokens.length > 0
        ? await this.fetchAssetIds(l1Rpc, primaryL1Vault, l1Tokens, L1_CHAIN)
        : new Map<EthereumAddress, `0x${string}`>()

    const l2AssetIdsByChain = new Map<
      string,
      Map<EthereumAddress, `0x${string}`>
    >()
    for (const network of l2Networks) {
      const l2Rpc = this.rpcs.get(network.chain)
      if (!l2Rpc) continue
      const l2Bridge = ChainSpecificAddress.address(network.l2SharedBridge)
      const tokens = l2TokensByChain.get(network.chain) ?? []
      const assetIdsByToken =
        tokens.length > 0
          ? await this.fetchAssetIds(l2Rpc, l2Bridge, tokens, network.chain)
          : new Map<EthereumAddress, `0x${string}`>()
      l2AssetIdsByChain.set(network.chain, assetIdsByToken)
    }

    const l1TokensByAssetId = this.buildTokensByAssetId(
      L1_CHAIN,
      l1AssetIdsByToken,
    )
    const l2TokensByAssetId = new Map<string, Map<string, EthereumAddress>>()
    for (const [chain, assetIdsByToken] of l2AssetIdsByChain) {
      l2TokensByAssetId.set(
        chain,
        this.buildTokensByAssetId(chain, assetIdsByToken),
      )
    }

    const assetIdSet = new Set<string>(l1TokensByAssetId.keys())
    for (const tokensByAssetId of l2TokensByAssetId.values()) {
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
      l1Vaults,
      assetIds,
    )

    const l1Missing = assetIds.filter((assetId) => {
      return !l1TokensByAssetId.has(assetId)
    })
    if (l1Missing.length > 0) {
      const filled = await this.fetchTokenAddressesByAssetId(
        l1Rpc,
        primaryL1Vault,
        l1Missing,
        L1_CHAIN,
      )
      for (const [assetId, token] of filled) {
        this.setTokenForAssetId(L1_CHAIN, l1TokensByAssetId, assetId, token)
      }
    }

    for (const network of l2Networks) {
      const l2Rpc = this.rpcs.get(network.chain)
      if (!l2Rpc) continue
      const l2Bridge = ChainSpecificAddress.address(network.l2SharedBridge)
      const tokensByAssetId =
        l2TokensByAssetId.get(network.chain) ??
        new Map<string, EthereumAddress>()
      const l2Missing = assetIds.filter((assetId) => {
        return !tokensByAssetId.has(assetId)
      })
      if (l2Missing.length > 0) {
        const filled = await this.fetchTokenAddressesByAssetId(
          l2Rpc,
          l2Bridge,
          l2Missing,
          network.chain,
        )
        for (const [assetId, token] of filled) {
          this.setTokenForAssetId(
            network.chain,
            tokensByAssetId,
            assetId,
            token,
          )
        }
      }
      l2TokensByAssetId.set(network.chain, tokensByAssetId)
    }

    const mappings: ZkStackAssetMapping[] = []
    let skippedInsufficient = 0
    let skippedZeroAddresses = 0
    let missingOrigin = 0

    for (const assetId of assetIds) {
      const l1Token = l1TokensByAssetId.get(assetId)
      const l1Resolved =
        l1Token !== undefined && l1Token !== EthereumAddress.ZERO

      const l2TokenAddresses: Record<string, Address32> = {}
      let resolvedCount = l1Resolved ? 1 : 0

      for (const network of l2Networks) {
        const token = l2TokensByAssetId.get(network.chain)?.get(assetId)
        if (!token || token === EthereumAddress.ZERO) {
          continue
        }
        l2TokenAddresses[network.chain] = Address32.from(token)
        resolvedCount++
      }

      if (resolvedCount < 2) {
        skippedInsufficient++
        continue
      }

      if (!l1Resolved) {
        skippedZeroAddresses++
      }

      const originChainId = originChainIds.get(assetId) ?? 0
      if (originChainId === 0) {
        missingOrigin++
      }

      mappings.push({
        assetId: assetId as `0x${string}`,
        originChainId,
        l1TokenAddress: l1Resolved
          ? Address32.from(l1Token as EthereumAddress)
          : Address32.ZERO,
        l2TokenAddresses,
      })
    }

    if (skippedInsufficient > 0) {
      this.logger.warn('Discarded assetIds with insufficient addresses', {
        skipped: skippedInsufficient,
      })
    }
    if (skippedZeroAddresses > 0) {
      this.logger.warn('Mappings missing L1 token address', {
        count: skippedZeroAddresses,
      })
    }
    if (missingOrigin > 0) {
      this.logger.warn('Mappings missing originChainId', {
        count: missingOrigin,
      })
    }

    mappings.sort((a, b) => a.assetId.localeCompare(b.assetId))
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
    l1Vaults: EthereumAddress[],
    assetIds: string[],
  ): Promise<Map<string, number>> {
    const originChainIds = new Map<string, number>()
    let failed = 0

    for (const l1Vault of l1Vaults) {
      const unresolved = assetIds.filter(
        (assetId) => !originChainIds.has(assetId),
      )
      if (unresolved.length === 0) {
        break
      }

      const calls: CallParameters[] = unresolved.map((assetId) => ({
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
        originChainIds.set(unresolved[i], Number(originChainId))
      }
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
