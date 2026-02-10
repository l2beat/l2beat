/**
 * assetIds are multichain identifiers (same on all chains)
 * for unique assets in the zk stack eco
 * this config maps assetIds to their
 * deployed token addresses and origin chains
 *
 * recipe
 * 1. get all deployed token addresses per supported chain (e.g. ethereum, zksync2, abstract)
 * 2. for each chain get assetIds for all tokens from (1) by calling assetId(tokenAddress)
 * 3. for each chain get BASE_TOKEN_ASSET_ID and add it (map to l2GasToken on L2s)
 * 4. create a cross-chain set of assetIds and map the token addresses we already have from (1) per chain
 * 5. fill in missing token addresses by calling tokenAddress(assetId) on each chain for missing entries
 * 6. fill in origin chain ids by calling originChainId(assetId) on L1 for each assetId
 * 7. ...
 * 8. enjoy the mapping
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
import { L1_NATIVE_TOKEN_VAULT, SUPPORTED_CHAINS } from './zkstack.networks'

export interface ZkStackAssetMappingEntry {
  chainId: number
  deployedTokenAddresses: Record<string, Address32>
}

export type ZkStackAssetMapping = Record<string, ZkStackAssetMappingEntry>

export const ZkStackConfig = defineConfig<ZkStackAssetMapping>('zkstack')

const ASSET_ABI = parseAbi([
  'function assetId(address tokenAddress) view returns (bytes32)',
  'function originChainId(bytes32 assetId) view returns (uint256)',
  'function tokenAddress(bytes32 assetId) view returns (address)',
  'function BASE_TOKEN_ASSET_ID() view returns (bytes32)',
])

const MULTICALL_CHUNK = 150
const ZERO_ASSET_ID = `0x${'0'.repeat(64)}` as const

type ChainCallTarget = {
  chain: string
  contract: EthereumAddress
}

type ChainWithRpc = ChainCallTarget & { rpc: IRpcClient }

const CONFIG_SUPPORTED_CHAINS: ChainCallTarget[] = [
  {
    chain: 'ethereum',
    contract: ChainSpecificAddress.address(L1_NATIVE_TOKEN_VAULT),
  },
  ...SUPPORTED_CHAINS.map((network) => ({
    chain: network.chain,
    contract: ChainSpecificAddress.address(network.l2SharedBridge),
  })),
]

export class ZkStackConfigPlugin
  extends TimeLoop
  implements InteropConfigPlugin
{
  provides = [ZkStackConfig]

  constructor(
    private store: InteropConfigStore,
    protected logger: Logger,
    private rpcs: Map<string, IRpcClient>,
    private tokenDbClient: TokenDbClient,
  ) {
    super({ intervalMs: 20 * 60 * 1000 })
    this.logger = logger.for(this).tag({ tag: ZkStackConfig.key })
  }

  async run() {
    try {
      const latest = await this.getLatestAssets()
      if (!latest) {
        return
      }
      const previous = this.store.get(ZkStackConfig)
      if (!previous || !isEqual(previous, latest)) {
        this.logger.info('Assets updated', { plugin: ZkStackConfig.key })
        this.store.set(ZkStackConfig, latest)
      }
    } catch (error) {
      this.logger.error('Failed to update assets', { error })
    }
  }

  private async getLatestAssets(): Promise<ZkStackAssetMapping | undefined> {
    const supportedChains = CONFIG_SUPPORTED_CHAINS

    const ethRpc = this.rpcs.get('ethereum')
    if (!ethRpc) {
      throw new Error('Missing RPC client for ethereum')
    }

    const missingL2Networks = SUPPORTED_CHAINS.filter(
      (n) => !this.rpcs.has(n.chain),
    )
    if (missingL2Networks.length > 0) {
      const missingChains = missingL2Networks.map((n) => n.chain)
      this.logger.warn('Missing RPC clients for zkstack config plugin', {
        missingChains,
        expectedChains: SUPPORTED_CHAINS.map((n) => n.chain),
        hint: 'Make sure required RPC clients are available either through backend dependencies or example runner configuration',
      })
    }

    const supportedChainsToScan = supportedChains.flatMap((descriptor) => {
      const rpc = this.rpcs.get(descriptor.chain)
      if (!rpc) return []
      return [{ ...descriptor, rpc } satisfies ChainWithRpc]
    })

    if (supportedChainsToScan.length < 2) {
      this.logger.warn(
        'Need at least two zkstack RPC clients available, skipping update',
      )
      return
    }

    const tokensByChain = await this.getDeployedTokenAddressesByChain(
      supportedChainsToScan.map((descriptor) => descriptor.chain),
    )

    const tokensByAssetIdByChain = new Map<
      string,
      Map<string, EthereumAddress>
    >()

    await Promise.all(
      supportedChainsToScan.map(async ({ chain, contract, rpc }) => {
        const tokens = tokensByChain.get(chain) ?? []
        if (tokens.length === 0) {
          this.logger.warn('No tokens found in token database', { chain })
          tokensByAssetIdByChain.set(chain, new Map())
          return
        }

        const assetIdsByToken = await this.fetchAssetIds(
          rpc,
          contract,
          tokens,
          chain,
        )

        const tokensByAssetId = new Map<string, EthereumAddress>()
        for (const [token, assetId] of assetIdsByToken.entries()) {
          tokensByAssetId.set(assetId, token)
        }
        tokensByAssetIdByChain.set(chain, tokensByAssetId)
      }),
    )

    const gasTokenByChain = new Map(
      SUPPORTED_CHAINS.map((network) => [
        network.chain,
        ChainSpecificAddress.address(network.l2GasToken),
      ]),
    )

    const baseTokenAssetIds = new Set<string>()
    await Promise.all(
      supportedChainsToScan.map(async ({ chain, contract, rpc }) => {
        const assetId = await this.fetchBaseTokenAssetId(rpc, contract, chain)
        if (!assetId) return

        baseTokenAssetIds.add(assetId)
        const gasToken = gasTokenByChain.get(chain)
        if (!gasToken) return

        const tokensByAssetId =
          tokensByAssetIdByChain.get(chain) ??
          new Map<string, EthereumAddress>()
        tokensByAssetId.set(assetId, gasToken)
        tokensByAssetIdByChain.set(chain, tokensByAssetId)
      }),
    )

    const assetIdSet = new Set<string>()
    for (const tokensByAssetId of tokensByAssetIdByChain.values()) {
      for (const assetId of tokensByAssetId.keys()) {
        assetIdSet.add(assetId)
      }
    }
    for (const assetId of baseTokenAssetIds) {
      assetIdSet.add(assetId)
    }

    if (assetIdSet.size === 0) {
      this.logger.warn(
        'No assetIds resolved from available chains, skipping update',
      )
      return
    }

    const assetIds = [...assetIdSet]
    const originChainIdsPromise = this.fetchOriginChainIds(
      ethRpc,
      CONFIG_SUPPORTED_CHAINS[0].contract,
      assetIds,
    )

    await Promise.all(
      supportedChainsToScan.map(async ({ chain, contract, rpc }) => {
        const tokensByAssetId =
          tokensByAssetIdByChain.get(chain) ??
          new Map<string, EthereumAddress>()

        const missing: string[] = []
        for (const assetId of assetIds) {
          if (!tokensByAssetId.has(assetId)) {
            missing.push(assetId)
          }
        }

        if (missing.length === 0) {
          tokensByAssetIdByChain.set(chain, tokensByAssetId)
          return
        }

        const filled = await this.fetchTokenAddressesByAssetId(
          rpc,
          contract,
          missing,
          chain,
        )
        for (const [assetId, token] of filled) {
          if (token === EthereumAddress.ZERO) continue
          tokensByAssetId.set(assetId, token)
        }
        tokensByAssetIdByChain.set(chain, tokensByAssetId)
      }),
    )

    const originChainIds = await originChainIdsPromise

    const mappings: ZkStackAssetMapping = {}
    let skippedInsufficient = 0
    let missingOrigin = 0

    const orderedAssetIds = [...assetIds].sort((a, b) => a.localeCompare(b))
    for (const assetId of orderedAssetIds) {
      const deployedTokenAddresses: Record<string, Address32> = {}
      let resolvedCount = 0

      for (const { chain } of supportedChainsToScan) {
        const token = tokensByAssetIdByChain.get(chain)?.get(assetId)
        if (!token || token === EthereumAddress.ZERO) continue
        deployedTokenAddresses[chain] = Address32.from(token)
        resolvedCount++
      }

      // keeping assetIds that are resolved to addresses on at least two chains
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
        deployedTokenAddresses: deployedTokenAddresses,
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

  private async getDeployedTokenAddressesByChain(
    chains: string[],
  ): Promise<Map<string, EthereumAddress[]>> {
    const { abstractTokens, deployedWithoutAbstractTokens } =
      await this.tokenDbClient.abstractTokens.getAllWithDeployedTokens.query()

    const chainSet = new Set(chains)
    const uniqueByChain = new Map(
      chains.map((chain) => [chain, new Map<string, EthereumAddress>()]),
    )

    const addToken = (token: { chain: string; address: string }) => {
      if (!chainSet.has(token.chain)) return
      if (!token.address.startsWith('0x') || token.address.length !== 42) return

      const chainMap = uniqueByChain.get(token.chain)
      if (!chainMap) return
      chainMap.set(token.address.toLowerCase(), EthereumAddress(token.address))
    }

    // not really necessary to add orphaned deployed tokens but why not
    for (const token of deployedWithoutAbstractTokens) {
      addToken(token)
    }
    for (const abstractToken of abstractTokens) {
      for (const token of abstractToken.deployedTokens) {
        addToken(token)
      }
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

  private async fetchBaseTokenAssetId(
    rpc: IRpcClient,
    contract: EthereumAddress,
    chain: string,
  ): Promise<`0x${string}` | undefined> {
    try {
      const call: CallParameters = {
        to: contract,
        data: Bytes.fromHex(
          encodeFunctionData({
            abi: ASSET_ABI,
            functionName: 'BASE_TOKEN_ASSET_ID',
          }),
        ),
      }

      const latest = await rpc.getLatestBlockNumber()
      const result = await rpc.call(call, latest)
      if (result.toString() === '0x') {
        this.logger.warn('Failed to resolve base token assetId', { chain })
        return
      }

      const assetId = decodeFunctionResult({
        abi: ASSET_ABI,
        functionName: 'BASE_TOKEN_ASSET_ID',
        data: result.toString() as Hex,
      }) as `0x${string}`

      const normalized = assetId.toLowerCase() as `0x${string}`
      if (normalized === ZERO_ASSET_ID) {
        this.logger.warn('Resolved base token assetId to zero', { chain })
        return
      }

      this.logger.info('Resolved base token assetId', { chain })
      return normalized
    } catch (error) {
      this.logger.warn('Failed to resolve base token assetId', { chain, error })
      return
    }
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
