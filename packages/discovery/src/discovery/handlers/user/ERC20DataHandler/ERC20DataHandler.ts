import {
  assert,
  type ChainSpecificAddress,
  CoingeckoId,
} from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { chains } from '../../../../config/chains'
import type { IProvider } from '../../../provider/IProvider'
import type { Handler, HandlerResult } from '../../Handler'
import { getCoingeckoId } from './getCoingeckoId'
import { getTokenInfo } from './getTokenInfo'
import { SourceEntry } from './types'
import { today } from './utils'

export type ERC20DataDefinition = v.infer<typeof ERC20DataDefinition>
export const ERC20DataDefinition = v.strictObject({
  type: v.literal('ERC20Data'),
  overrides: SourceEntry,
})

export class ERC20DataHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    private readonly definition: ERC20DataDefinition,
  ) {}

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const entry = this.definition.overrides
    const source = getSource(provider.chain, entry)
    const supply = getSupply(provider.chain, entry)
    const category = entry?.category ?? 'other'

    const coinList = await provider.raw(
      `coingecko-coinList-${today()}`,
      (raw) =>
        raw.coingeckoClient.getCoinList({
          includePlatform: true,
        }),
    )

    const chain = chains.find((chain) => chain.name === provider.chain)

    const coingeckoId =
      entry?.coingeckoId ??
      getCoingeckoId(coinList, chain?.coingeckoPlatform, address)

    const info = await getTokenInfo(
      provider,
      address,
      CoingeckoId(coingeckoId),
      entry?.deploymentTimestamp,
    )

    return Promise.resolve({
      field: '$tokenData',
      value: {
        name: info.name,
        coingeckoId: info.coingeckoId,
        address: address,
        symbol: info.symbol,
        decimals: info.decimals,
        deploymentTimestamp: info.deploymentTimestamp,
        coingeckoListingTimestamp: info.coingeckoListingTimestamp,
        category,
        iconUrl: info.iconUrl,
        chainId: chain?.chainId,
        supply,
        source,
        bridgedUsing: entry?.bridgedUsing,
        excludeFromTotal: entry?.excludeFromTotal,
      },
    })
  }
}

function getSource(chain: string, entry: SourceEntry) {
  const type = chain === 'ethereum' ? 'canonical' : entry?.source
  assert(type !== undefined, 'Missing source type')
  return type
}

function getSupply(chain: string, entry: SourceEntry) {
  const formula = chain === 'ethereum' ? 'zero' : entry?.supply
  assert(formula !== undefined, 'Missing supply formula')
  return formula
}
