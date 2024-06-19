import { assert } from '@l2beat/backend-tools'
import { safeGetTokenByAssetId } from '@l2beat/config'
import {
  AssetId,
  CanonicalAssetBreakdownData,
  ExternalAssetBreakdownData,
  NativeAssetBreakdownData,
  ProjectAssetsBreakdownApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'
import { ChainConverter } from '../../../../tools/ChainConverter'
import { ConfigMapping } from '../../utils/ConfigMapping'
import { SyncOptimizer } from '../../utils/SyncOptimizer'
import { asNumber } from '../../utils/asNumber'
import { CanonicalAssetBreakdown } from '../utils/types'
import { DataService } from './DataService'

interface Dependencies {
  dataService: DataService
  syncOptimizer: SyncOptimizer
  chainConverter: ChainConverter
  configMapping: ConfigMapping
}

export class BreakdownService {
  constructor(private readonly $: Dependencies) {}

  async getTvlBreakdown(
    timestamp: UnixTime,
  ): Promise<ProjectAssetsBreakdownApiResponse> {
    const tokenAmounts =
      await this.$.dataService.getAmountsByConfigIdsAndTimestamp(timestamp)
    const prices =
      await this.$.dataService.getPricesByConfigIdsAndTimestamp(timestamp)

    const pricesMap = new Map(prices.map((x) => [x.configId, x.priceUsd]))
    const breakdowns: Record<
      string,
      {
        canonical: Map<AssetId, CanonicalAssetBreakdown>
        external: ExternalAssetBreakdownData[]
        native: NativeAssetBreakdownData[]
      }
    > = {}
    for (const amount of tokenAmounts) {
      const config = this.$.configMapping.getAmountConfig(amount.configId)
      if (config.untilTimestamp && config.untilTimestamp.lt(timestamp)) {
        continue
      }

      let breakdown = breakdowns[config.project]
      if (!breakdown) {
        breakdown = {
          canonical: new Map<AssetId, CanonicalAssetBreakdown>(),
          external: [],
          native: [],
        }
        breakdowns[config.project] = breakdown
      }

      const priceConfig =
        this.$.configMapping.getPriceConfigFromAmountConfig(config)
      const price = pricesMap.get(priceConfig.configId)
      assert(price, 'Price not found for id ' + amount.configId)

      const amountAsNumber = asNumber(amount.amount, config.decimals)
      const valueAsNumber = amountAsNumber * price

      switch (config.source) {
        case 'canonical': {
          // The canonical logic is the most complex one
          assert(config.type === 'escrow', 'Only escrow can be canonical')
          const asset = breakdown.canonical.get(priceConfig.assetId)
          if (asset) {
            asset.usdValue += valueAsNumber
            asset.amount += amountAsNumber
            asset.escrows.push({
              amount: amountAsNumber.toString(),
              usdValue: valueAsNumber.toString(),
              escrowAddress: config.escrowAddress,
            })
          } else {
            breakdown.canonical.set(priceConfig.assetId, {
              assetId: priceConfig.assetId,
              chainId: this.$.chainConverter.toChainId(config.chain),
              amount: amountAsNumber,
              usdValue: valueAsNumber,
              usdPrice: price.toString(),
              escrows: [
                {
                  amount: amountAsNumber.toString(),
                  usdValue: valueAsNumber.toString(),
                  escrowAddress: config.escrowAddress,
                },
              ],
            })
          }
          break
        }
        case 'external': {
          const token = safeGetTokenByAssetId(priceConfig.assetId)

          breakdown.external.push({
            assetId: priceConfig.assetId,
            chainId: this.$.chainConverter.toChainId(config.chain),
            amount: amountAsNumber.toString(),
            usdValue: valueAsNumber.toString(),
            usdPrice: price.toString(),
            tokenAddress:
              config.address === 'native' ? undefined : config.address,
            bridge: config.bridge ?? {
              name: token?.bridgedUsing?.bridge ?? 'Unknown',
              slug: token?.bridgedUsing?.slug,
              warning: token?.bridgedUsing?.warning,
            },
          })
          break
        }
        case 'native':
          breakdown.native.push({
            assetId: priceConfig.assetId,
            chainId: this.$.chainConverter.toChainId(config.chain),
            amount: amountAsNumber.toString(),
            usdValue: valueAsNumber.toString(),
            usdPrice: price.toString(),
            // TODO: force fe to accept "native"
            tokenAddress:
              config.address === 'native' ? undefined : config.address,
          })
      }
    }
    const result: Record<
      string,
      {
        canonical: CanonicalAssetBreakdownData[]
        external: ExternalAssetBreakdownData[]
        native: NativeAssetBreakdownData[]
      }
    > = {}
    for (const [project, breakdown] of Object.entries(breakdowns)) {
      const canonical = [...breakdown.canonical.values()].sort(
        (a, b) => +b.usdValue - +a.usdValue,
      )

      result[project] = {
        canonical: canonical.map((x) => ({
          ...x,
          escrows: x.escrows.sort((a, b) => +b.amount - +a.amount),
          amount: x.amount.toString(),
          usdValue: x.usdValue.toString(),
        })),
        external: breakdown.external.sort((a, b) => +b.usdValue - +a.usdValue),
        native: breakdown.native.sort((a, b) => +b.usdValue - +a.usdValue),
      }
    }

    return { dataTimestamp: timestamp, breakdowns: result }
  }
}
