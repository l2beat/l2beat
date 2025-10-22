import type { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { v } from '@l2beat/validate'
import { TimeLoop } from '../../../../tools/TimeLoop'
import {
  defineConfig,
  type InteropConfigPlugin,
  type InteropConfigStore,
} from '../../InteropConfigStore'

export interface LayerZeroV2Network {
  chainId: number
  eid: number
  chain: string
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
    private configs: InteropConfigStore,
    protected logger: Logger,
    private http: HttpClient,
    intervalMs = 10 * 60 * 1000,
  ) {
    super({ intervalMs })
  }

  async run() {
    const v2 = await this.getNetworks()
    this.configs.set(LayerZeroConfig, { v2 })
  }

  async getNetworks(): Promise<LayerZeroV2Network[]> {
    const response = await this.http.fetch(DOCS_URL, { timeout: 10_000 })
    const docs = DocsResult.parse(response)

    const chains = [...this.chains, ...OVERRIDES]

    const config: LayerZeroV2Network[] = []
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
            chainId: chain.id,
            eid: Number(v2.eid),
            chain: chain.name,
            endpointV2: v2.endpointV2.address,
          })
        }
      }
    }

    return config
  }
}
