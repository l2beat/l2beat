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
    deployments: v
      .array(
        v.object({
          eid: v.string().optional(),
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

const OVERRIDES = {
  v2: [
    {
      eid: 30168,
      chain: 'solana',
    },
  ],
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
  ) {
    super({ intervalMs: 20 * 60 * 1000 })
    this.logger = logger.for(this)
  }

  async run() {
    const latest = await this.getLatestNetworks()

    const previousV1 = this.store.get(LayerZeroV1Config)
    const reconciledV1 = reconcileNetworks(previousV1, latest.v1)

    if (reconciledV1.removed.length > 0) {
      this.logger.error('Networks removed', {
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
      this.logger.error('Networks removed', {
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

    const config: {
      v1: LayerZeroV1Network[]
      v2: LayerZeroV2Network[]
    } = {
      v1: [],
      v2: [...OVERRIDES.v2],
    }
    for (const [_, value] of Object.entries(docs)) {
      if (
        value === undefined ||
        value.chainDetails === undefined ||
        value.chainDetails.nativeChainId === undefined
      ) {
        continue
      }

      // API returns chainId = 1 for Aptos xd
      if (value.chainDetails.chainKey === 'aptos') {
        continue
      }

      const chain = this.chains.find(
        (c) => c.id === value.chainDetails?.nativeChainId,
      )

      if (chain) {
        const v1 = value.deployments?.find((d) => d.version === 1)
        if (
          v1 &&
          v1.stage === 'mainnet' &&
          v1.eid &&
          v1.sendUln301 &&
          v1.receiveUln301
        ) {
          config.v1.push({
            chain: chain.name,
            chainId: chain.id,
            eid: Number(v1.eid),
            sendLib:
              typeof v1.sendUln301 === 'string'
                ? EthereumAddress(v1.sendUln301)
                : EthereumAddress(v1.sendUln301.address),
            receiveLib:
              typeof v1.receiveUln301 === 'string'
                ? EthereumAddress(v1.receiveUln301)
                : EthereumAddress(v1.receiveUln301.address),
          })
        }

        const v2 = value.deployments?.find((d) => d.version === 2)
        if (v2 && v2.stage === 'mainnet' && v2.eid && v2.endpointV2) {
          config.v2.push({
            chain: chain.name,
            chainId: chain.id,
            eid: Number(v2.eid),
            endpointV2:
              typeof v2.endpointV2 === 'string'
                ? EthereumAddress(v2.endpointV2)
                : EthereumAddress(v2.endpointV2.address),
          })
        }
      }
    }

    return config
  }
}
