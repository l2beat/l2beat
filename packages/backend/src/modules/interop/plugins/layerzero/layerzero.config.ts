import type { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
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
  chainId: number
  eid: number
  endpointV2: string // fix issue with EthereumAddress
}

export const LayerZeroConfig = defineConfig<{ v2: LayerZeroV2Network[] }>(
  'layerzero',
)

const DOCS_URL = 'https://metadata.layerzero-api.com/v1/metadata/deployments'

const DocsResult = v.record(
  v.string(),
  v.object({
    deployments: v
      .array(
        v.object({
          eid: v.string().optional(),
          version: v.number().optional(),
          endpointV2: v
            .object({
              address: v.string(),
            })
            .optional(),
        }),
      )
      .optional(),
    chainDetails: v.object({ nativeChainId: v.number().optional() }).optional(),
  }),
)

const OVERRIDES: { id: number; name: string }[] = [] //TODO: fill

export class LayerZeroConfigPlugin
  extends TimeLoop
  implements InteropConfigPlugin
{
  provides = LayerZeroConfig

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
    const previous = this.store.get(this.provides)
    const latest = await this.getLatestNetworks()

    const reconciled = reconcileNetworks(previous?.v2, latest.v2)

    if (reconciled.removed.length > 0) {
      this.logger.error('Networks removed', {
        plugin: this.provides.key,
        removed: reconciled.removed,
      })
      return
    }

    if (reconciled.updated.length > 0) {
      this.logger.info('Networks updated', {
        plugin: this.provides.key,
      })
      this.store.set(this.provides, { v2: reconciled.updated })
    }
  }

  async getLatestNetworks(): Promise<{ v2: LayerZeroV2Network[] }> {
    const response = await this.http.fetch(DOCS_URL, { timeout: 10_000 })
    const docs = DocsResult.parse(response)

    const chains = [...this.chains, ...OVERRIDES]

    const config = []
    for (const [_, value] of Object.entries(docs)) {
      if (
        value === undefined ||
        value.chainDetails === undefined ||
        value.chainDetails.nativeChainId === undefined
      ) {
        continue
      }

      const chain = chains.find(
        (c) => c.id === value.chainDetails?.nativeChainId,
      )

      if (chain) {
        const v2 = value.deployments?.find((d) => d.version === 2)
        if (v2 && v2.eid && v2.endpointV2?.address) {
          // TODO: v1 is in the same endpoint, a plugin should return both? or two plugins?
          config.push({
            chain: chain.name,
            chainId: chain.id,
            eid: Number(v2.eid),
            endpointV2: v2.endpointV2.address,
          })
        }
      }
    }

    return { v2: config }
  }
}
