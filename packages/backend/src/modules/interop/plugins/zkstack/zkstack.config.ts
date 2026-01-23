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
  l2TokenAddress: Address32
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
      const previous = this.store.get(ZkStackAssetsConfig)
      if (!previous || !isEqual(previous, latest)) {
        this.logger.info('Assets updated', { plugin: ZkStackAssetsConfig.key })
        this.store.set(ZkStackAssetsConfig, latest)
      }
    } catch (error) {
      this.logger.error('Failed to update assets', { error })
    }
  }

  private async getLatestAssets(): Promise<ZkStackAssetMapping[]> {
    const l1Rpc = this.rpcs.get(L1_CHAIN)
    if (!l1Rpc) {
      throw new Error(`Missing RPC client for ${L1_CHAIN}`)
    }

    const l2Network = ZKSTACK_SUPPORTED.find((n) => this.rpcs.has(n.chain))
    if (!l2Network) {
      throw new Error('Missing RPC client for zksync2')
    }

    const l2Rpc = this.rpcs.get(l2Network.chain)
    if (!l2Rpc) {
      throw new Error(`Missing RPC client for ${l2Network.chain}`)
    }

    const l1Tokens = await this.getTokenAddresses(L1_CHAIN)
    if (l1Tokens.length === 0) {
      throw new Error('No L1 tokens found in token database')
    }

    const l2Tokens = await this.getTokenAddresses(l2Network.chain)
    if (l2Tokens.length === 0) {
      throw new Error('No L2 tokens found in token database')
    }

    const l1Vault = ChainSpecificAddress.address(l2Network.l1NativeTokenVault)
    const l2Bridge = ChainSpecificAddress.address(l2Network.l2SharedBridge)

    const l1AssetIdsByToken = await this.fetchAssetIds(l1Rpc, l1Vault, l1Tokens)
    const l2AssetIdsByToken = await this.fetchAssetIds(
      l2Rpc,
      l2Bridge,
      l2Tokens,
    )

    if (l1AssetIdsByToken.size === 0 && l2AssetIdsByToken.size === 0) {
      throw new Error('No assetIds resolved from L1 or L2')
    }

    const l1TokensByAssetId = this.buildTokensByAssetId(l1AssetIdsByToken)
    const l2TokensByAssetId = this.buildTokensByAssetId(l2AssetIdsByToken)

    const assetIdSet = new Set<string>([
      ...l1TokensByAssetId.keys(),
      ...l2TokensByAssetId.keys(),
    ])

    const assetIds = [...assetIdSet]
    const originChainIds = await this.fetchOriginChainIds(
      l1Rpc,
      l1Vault,
      assetIds,
    )

    const l1Missing = assetIds.filter((assetId) => {
      return !l1TokensByAssetId.has(assetId)
    })
    if (l1Missing.length > 0) {
      const filled = await this.fetchTokenAddressesByAssetId(
        l1Rpc,
        l1Vault,
        l1Missing,
      )
      for (const [assetId, token] of filled) {
        l1TokensByAssetId.set(assetId, token)
      }
    }

    const l2Missing = assetIds.filter((assetId) => {
      return !l2TokensByAssetId.has(assetId)
    })
    if (l2Missing.length > 0) {
      const filled = await this.fetchTokenAddressesByAssetId(
        l2Rpc,
        l2Bridge,
        l2Missing,
      )
      for (const [assetId, token] of filled) {
        l2TokensByAssetId.set(assetId, token)
      }
    }

    const mappings: ZkStackAssetMapping[] = []

    for (const assetId of assetIds) {
      const originChainId = originChainIds.get(assetId)
      if (!originChainId) continue

      const l1Token = l1TokensByAssetId.get(assetId)
      const l2Token = l2TokensByAssetId.get(assetId)
      if (!l1Token || !l2Token) continue
      if (l1Token === EthereumAddress.ZERO || l2Token === EthereumAddress.ZERO)
        continue

      mappings.push({
        assetId: assetId as `0x${string}`,
        originChainId,
        l1TokenAddress: Address32.from(l1Token),
        l2TokenAddress: Address32.from(l2Token),
      })
    }

    mappings.sort((a, b) => a.assetId.localeCompare(b.assetId))
    return mappings
  }

  private async getTokenAddresses(chain: string): Promise<EthereumAddress[]> {
    const { abstractTokens, deployedWithoutAbstractTokens } =
      await this.tokenDbClient.abstractTokens.getAllWithDeployedTokens.query()

    const deployed = [
      ...deployedWithoutAbstractTokens,
      ...abstractTokens.flatMap((token) => token.deployedTokens),
    ]

    const unique = new Map<string, EthereumAddress>()
    for (const token of deployed) {
      if (token.chain !== chain) continue
      if (!token.address.startsWith('0x') || token.address.length !== 42)
        continue
      unique.set(token.address.toLowerCase(), EthereumAddress(token.address))
    }

    return [...unique.values()]
  }

  private buildTokensByAssetId(
    assetIdsByToken: Map<EthereumAddress, `0x${string}`>,
  ): Map<string, EthereumAddress> {
    const tokensByAssetId = new Map<string, EthereumAddress>()
    for (const [token, assetId] of assetIdsByToken.entries()) {
      tokensByAssetId.set(assetId, token)
    }
    return tokensByAssetId
  }

  private async fetchAssetIds(
    rpc: IRpcClient,
    contract: EthereumAddress,
    tokens: EthereumAddress[],
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

    const originChainIds = new Map<string, number>()
    let failed = 0

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
