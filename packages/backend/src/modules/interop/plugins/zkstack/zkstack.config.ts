import type { Logger } from '@l2beat/backend-tools'
import type { CallParameters, IRpcClient } from '@l2beat/shared'
import {
  Address32,
  Bytes,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
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
import { reconcileNetworks } from '../../engine/config/reconcileNetworks'
import { ZKSTACK_SUPPORTED, ZKSYNC_GAS_ASSET_ID } from './zkstack.networks'

interface ZkStackAssetEntry {
  assetId: `0x${string}`
  tokenAddress: Address32
}

export interface ZkStackChainAssets {
  chain: string
  chainId: number
  assets: ZkStackAssetEntry[]
}

export const ZkStackAssetsConfig =
  defineConfig<ZkStackChainAssets[]>('zkstack-assets')

const ASSET_ABI = parseAbi([
  'function assetId(address tokenAddress) view returns (bytes32)',
  'function calculateCreate2TokenAddress(uint256 _originChainId, address _nonNativeToken) view returns (address)',
])

const L1_CHAIN = 'ethereum'
const L1_CHAIN_ID = 1n
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
      const reconciled = reconcileNetworks(previous, latest)

      if (reconciled.removed.length > 0) {
        this.logger.error('Networks removed', {
          plugin: ZkStackAssetsConfig.key,
          removed: reconciled.removed,
        })
      }

      if (reconciled.updated.length > 0) {
        this.logger.info('Assets updated', { plugin: ZkStackAssetsConfig.key })
        this.store.set(ZkStackAssetsConfig, reconciled.updated)
      }
    } catch (error) {
      this.logger.error('Failed to update assets', { error })
    }
  }

  private async getLatestAssets(): Promise<ZkStackChainAssets[]> {
    const l1Rpc = this.rpcs.get(L1_CHAIN)
    if (!l1Rpc) {
      throw new Error(`Missing RPC client for ${L1_CHAIN}`)
    }

    const l2Networks = ZKSTACK_SUPPORTED.filter((n) => this.rpcs.has(n.chain))
    if (l2Networks.length === 0) {
      throw new Error('Missing RPC clients for ZK stack chains')
    }

    const l1Tokens = await this.getL1TokenAddresses()
    if (l1Tokens.length === 0) {
      throw new Error('No L1 tokens found in token database')
    }

    const l1Vault = ChainSpecificAddress.address(
      l2Networks[0].l1NativeTokenVault,
    )
    const assetIdsByToken = await this.fetchAssetIds(l1Rpc, l1Vault, l1Tokens)
    if (assetIdsByToken.size === 0) {
      throw new Error('No assetIds resolved from L1 vault')
    }

    const l1Assets = this.buildAssets(
      assetIdsByToken,
      new Map(l1Tokens.map((token) => [token, token] as const)),
    )

    const configs: ZkStackChainAssets[] = [
      {
        chain: L1_CHAIN,
        chainId: Number(L1_CHAIN_ID),
        assets: this.withGasAsset(l1Assets),
      },
    ]

    for (const network of l2Networks) {
      const l2Rpc = this.rpcs.get(network.chain)
      if (!l2Rpc) continue

      const l2Bridge = ChainSpecificAddress.address(network.l2SharedBridge)
      const l2TokensByL1 = await this.fetchL2TokenAddresses(
        l2Rpc,
        l2Bridge,
        l1Tokens,
      )
      if (l2TokensByL1.size === 0) {
        throw new Error(`No L2 token addresses resolved for ${network.chain}`)
      }

      const l2Assets = this.buildAssets(assetIdsByToken, l2TokensByL1)

      configs.push({
        chain: network.chain,
        chainId: network.chainId,
        assets: this.withGasAsset(l2Assets),
      })
    }

    return configs
  }

  private async getL1TokenAddresses(): Promise<EthereumAddress[]> {
    const { abstractTokens, deployedWithoutAbstractTokens } =
      await this.tokenDbClient.abstractTokens.getAllWithDeployedTokens.query()

    const deployed = [
      ...deployedWithoutAbstractTokens,
      ...abstractTokens.flatMap((token) => token.deployedTokens),
    ]

    const unique = new Map<string, EthereumAddress>()
    for (const token of deployed) {
      if (token.chain !== L1_CHAIN) continue
      if (!token.address.startsWith('0x') || token.address.length !== 42)
        continue
      unique.set(token.address.toLowerCase(), EthereumAddress(token.address))
    }

    return [...unique.values()]
  }

  private async fetchAssetIds(
    rpc: IRpcClient,
    l1Vault: EthereumAddress,
    tokens: EthereumAddress[],
  ): Promise<Map<EthereumAddress, `0x${string}`>> {
    const calls: CallParameters[] = tokens.map((token) => ({
      to: l1Vault,
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

  private async fetchL2TokenAddresses(
    rpc: IRpcClient,
    l2Bridge: EthereumAddress,
    tokens: EthereumAddress[],
  ): Promise<Map<EthereumAddress, EthereumAddress>> {
    const calls: CallParameters[] = tokens.map((token) => ({
      to: l2Bridge,
      data: Bytes.fromHex(
        encodeFunctionData({
          abi: ASSET_ABI,
          functionName: 'calculateCreate2TokenAddress',
          args: [L1_CHAIN_ID, token as `0x${string}`],
        }),
      ),
    }))

    const latest = await rpc.getLatestBlockNumber()
    const results = await this.multicallInChunks(rpc, calls, latest)

    const l2Tokens = new Map<EthereumAddress, EthereumAddress>()
    let failed = 0

    for (const [i, result] of results.entries()) {
      if (!result.success || result.data.toString() === '0x') {
        failed++
        continue
      }

      const l2Token = decodeFunctionResult({
        abi: ASSET_ABI,
        functionName: 'calculateCreate2TokenAddress',
        data: result.data.toString() as Hex,
      }) as `0x${string}`

      l2Tokens.set(tokens[i], EthereumAddress(l2Token))
    }

    this.logger.info('Resolved L2 token addresses', {
      total: tokens.length,
      resolved: l2Tokens.size,
      failed,
    })

    return l2Tokens
  }

  private buildAssets(
    assetIdsByToken: Map<EthereumAddress, `0x${string}`>,
    tokenAddresses: Map<EthereumAddress, EthereumAddress>,
  ): ZkStackAssetEntry[] {
    const assets: ZkStackAssetEntry[] = []

    for (const [token, assetId] of assetIdsByToken) {
      const tokenAddress = tokenAddresses.get(token)
      if (!tokenAddress) continue
      assets.push({
        assetId,
        tokenAddress: Address32.from(tokenAddress),
      })
    }

    assets.sort((a, b) => a.assetId.localeCompare(b.assetId))
    return assets
  }

  private withGasAsset(assets: ZkStackAssetEntry[]): ZkStackAssetEntry[] {
    const gasAssetId = ZKSYNC_GAS_ASSET_ID as `0x${string}`
    const next = assets.some((asset) => asset.assetId === gasAssetId)
      ? [...assets]
      : [
          ...assets,
          {
            assetId: gasAssetId,
            tokenAddress: Address32.NATIVE,
          },
        ]

    next.sort((a, b) => a.assetId.localeCompare(b.assetId))
    return next
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
