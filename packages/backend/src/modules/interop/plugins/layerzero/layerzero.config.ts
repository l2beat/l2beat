import type { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { TimeLoop } from '../../../../tools/TimeLoop'
import {
  defineConfig,
  type InteropConfigPlugin,
  type InteropConfigStore,
} from '../../engine/config/InteropConfigStore'
import { reconcileNetworks } from '../../engine/config/reconcileNetworks'

export interface LayerZeroV1Network {
  chain: string
  chainId: number
  eid: number
  sendLib: EthereumAddress
  receiveLib: EthereumAddress
}

export interface LayerZeroV2Network {
  chain: string
  chainId?: number
  eid: number
  endpointV2?: EthereumAddress
}

export const LayerZeroV1Config =
  defineConfig<LayerZeroV1Network[]>('layerzero-v1')

export const LayerZeroV2Config =
  defineConfig<LayerZeroV2Network[]>('layerzero-v2')

const DOCS_URL = 'https://metadata.layerzero-api.com/v1/metadata/deployments'

const DocsResult = v.record(
  v.string(),
  v.object({
    chainKey: v.string(),
    deployments: v
      .array(
        v.object({
          eid: v.string().optional(),
          chainKey: v.string().optional(),
          version: v.number().optional(),
          stage: v.string().optional(),
          endpointV2: v
            .union([
              v.object({
                address: v.string(),
              }),
              v.string(),
            ])
            .optional(),
          sendUln301: v
            .union([
              v.object({
                address: v.string(),
              }),
              v.string(),
            ])
            .optional(),
          receiveUln301: v
            .union([
              v.object({
                address: v.string(),
              }),
              v.string(),
            ])
            .optional(),
        }),
      )
      .optional(),
    chainDetails: v
      .object({
        chainKey: v.string().optional(),
        nativeChainId: v.number().optional(),
      })
      .optional(),
  }),
)

const LAYERZERO_CHAIN_KEY_OVERRIDES = {
  ape: 'apechain',
  edu: 'educhain',
  hyperliquid: 'hyperevm',
  mp1: 'corn',
  plumephoenix: 'plumenetwork',
  polygon: 'polygonpos',
  zklink: 'zklinknova',
  zkevm: 'polygonzkevm',
  zksync: 'zksync2',
} as const

function normalizeLayerZeroChainKey(chainKey: string) {
  const normalized = chainKey
    .toLowerCase()
    .replace(/-mainnet(?:-custom)?$/, '')
    .replace(/-testnet$/, '')

  const override =
    LAYERZERO_CHAIN_KEY_OVERRIDES[
      normalized as keyof typeof LAYERZERO_CHAIN_KEY_OVERRIDES
    ]

  return override ?? normalized
}

function getAddress(
  value:
    | string
    | {
        address: string
      },
) {
  return typeof value === 'string' ? value : value.address
}

function toEthereumAddress(
  value:
    | string
    | {
        address: string
      }
    | undefined,
) {
  if (!value) return
  const address = getAddress(value)
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) return
  return EthereumAddress(address)
}

export class LayerZeroConfigPlugin
  extends TimeLoop
  implements InteropConfigPlugin
{
  provides = [LayerZeroV1Config, LayerZeroV2Config]

  constructor(
    private chains: { id: number; name: string }[],
    private store: InteropConfigStore,
    protected logger: Logger,
    private http: HttpClient,
    intervalMs: number,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this)
  }

  async run() {
    const latest = await this.getLatestNetworks()

    const previousV1 = this.store.get(LayerZeroV1Config)
    const reconciledV1 = reconcileNetworks(previousV1, latest.v1)

    if (reconciledV1.removed.length > 0) {
      this.logger.info('Upstream networks removed', {
        plugin: LayerZeroV1Config.key,
        removed: reconciledV1.removed,
      })
    }

    if (reconciledV1.updated.length > 0) {
      this.logger.info('Networks updated', {
        plugin: LayerZeroV1Config.key,
      })
      this.store.set(LayerZeroV1Config, reconciledV1.updated)
    }

    const previousV2 = this.store.get(LayerZeroV2Config)
    const reconciledV2 = reconcileNetworks(previousV2, latest.v2)

    if (reconciledV2.removed.length > 0) {
      this.logger.info('Upstream networks removed', {
        plugin: LayerZeroV2Config.key,
        removed: reconciledV2.removed,
      })
    }

    if (reconciledV2.updated.length > 0) {
      this.logger.info('Networks updated', {
        plugin: LayerZeroV2Config.key,
      })
      this.store.set(LayerZeroV2Config, reconciledV2.updated)
    }
  }

  async getLatestNetworks(): Promise<{
    v1: LayerZeroV1Network[]
    v2: LayerZeroV2Network[]
  }> {
    const response = await this.http.fetch(DOCS_URL, { timeout: 10_000 })
    const docs = DocsResult.parse(response)
    const chainsById = new Map(this.chains.map((chain) => [chain.id, chain]))
    const v1: LayerZeroV1Network[] = []
    const v2: LayerZeroV2Network[] = []

    for (const value of Object.values(docs)) {
      const chain = normalizeLayerZeroChainKey(value.chainKey)

      const chainById =
        value.chainDetails?.nativeChainId !== undefined
          ? chainsById.get(value.chainDetails.nativeChainId)
          : undefined

      // API returns chainId = 1 for Aptos, so only trust v1 entries when
      // the chainKey agrees with our local chain map.
      if (chainById?.name === chain) {
        const deployment = value.deployments?.find((d) => d.version === 1)
        if (
          deployment &&
          deployment.stage === 'mainnet' &&
          deployment.eid &&
          deployment.sendUln301 &&
          deployment.receiveUln301
        ) {
          v1.push({
            chain: chainById.name,
            chainId: chainById.id,
            eid: Number(deployment.eid),
            sendLib: EthereumAddress(getAddress(deployment.sendUln301)),
            receiveLib: EthereumAddress(getAddress(deployment.receiveUln301)),
          })
        }
      }

      for (const deployment of value.deployments ?? []) {
        if (
          deployment.version !== 2 ||
          deployment.stage !== 'mainnet' ||
          !deployment.eid
        ) {
          continue
        }

        v2.push({
          chain,
          chainId: value.chainDetails?.nativeChainId,
          eid: Number(deployment.eid),
          endpointV2: toEthereumAddress(deployment.endpointV2),
        })
      }
    }

    return { v1, v2 }
  }
}
