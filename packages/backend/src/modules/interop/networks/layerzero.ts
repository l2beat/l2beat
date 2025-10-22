import type { HttpClient } from '@l2beat/shared'
import { v } from '@l2beat/validate'
import type {
  InteropNetworks,
  InteropNetworksPlugin,
  LayerZeroV2Networks,
} from './types'

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

export class LayerZeroNetworksPlugin implements InteropNetworksPlugin {
  name = 'layerzero'

  constructor(
    private chains: { id: number; name: string }[],
    private http: HttpClient,
  ) {}

  async getLatestNetworks(): Promise<LayerZeroV2Networks[]> {
    const response = await this.http.fetch(DOCS_URL, { timeout: 10_000 })
    const docs = DocsResult.parse(response)

    const chains = [...this.chains, ...OVERRIDES]

    const config: LayerZeroV2Networks[] = []
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

  reconcileNetworks(
    previous: InteropNetworks | undefined,
    latest: InteropNetworks,
  ): InteropNetworks | 'not-changed' {
    // TODO: do we need it per plugin?
    return latest
  }
}
