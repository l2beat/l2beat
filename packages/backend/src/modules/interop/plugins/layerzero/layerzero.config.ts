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

export interface LayerZeroV2Network {
  chain: string
  chainId?: number
  eid: number
  endpointV2?: EthereumAddress
}

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
        }),
      )
      .optional(),
    chainDetails: v
      .object({
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

function toEthereumAddress(
  value:
    | string
    | {
        address: string
      }
    | undefined,
) {
  if (!value) return
  const address = typeof value === 'string' ? value : value.address
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) return
  return EthereumAddress(address)
}

export class LayerZeroConfigPlugin
  extends TimeLoop
  implements InteropConfigPlugin
{
  provides = [LayerZeroV2Config]

  constructor(
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

    const previousV2 = this.store.get(LayerZeroV2Config)
    const reconciledV2 = reconcileNetworks(previousV2, latest)

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

  async getLatestNetworks(): Promise<LayerZeroV2Network[]> {
    const response = await this.http.fetch(DOCS_URL, { timeout: 10_000 })
    const docs = DocsResult.parse(response)
    const v2: LayerZeroV2Network[] = []

    for (const value of Object.values(docs)) {
      const chain = normalizeLayerZeroChainKey(value.chainKey)

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

    return v2
  }
}
