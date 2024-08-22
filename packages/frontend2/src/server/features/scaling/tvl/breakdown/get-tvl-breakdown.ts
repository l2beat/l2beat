import { type ConfigMapping, safeGetTokenByAssetId } from '@l2beat/config'
import {
  asNumber,
  assert,
  type AssetId,
  type CanonicalAssetBreakdownData,
  type ExternalAssetBreakdownData,
  type NativeAssetBreakdownData,
  type ProjectAssetsBreakdownApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'
import { chainConverter } from './chain-converter'
import { getLatestAmountForConfigurations } from './get-latest-amount-for-configurations'
import { getLatestPriceForConfigurations } from './get-latest-price-for-configurations'
import { type CanonicalAssetBreakdown } from './types'

interface Dependencies {
  configMapping: ConfigMapping
}

export function getTvlBreakdown({ configMapping }: Dependencies) {
  return async function (
    target?: UnixTime,
  ): Promise<ProjectAssetsBreakdownApiResponse> {
    const targetTimestamp =
      target ?? UnixTime.now().toStartOf('hour').add(-1, 'hours')

    const prices = await getLatestPriceForConfigurations(
      configMapping.prices,
      targetTimestamp,
    )

    const tokenAmounts = await getLatestAmountForConfigurations(
      configMapping.amounts,
      targetTimestamp,
    )

    const pricesMap = new Map(
      prices.prices.map((x) => [x.configId, x.priceUsd]),
    )

    const breakdowns: Record<
      string,
      {
        canonical: Map<AssetId, CanonicalAssetBreakdown>
        external: ExternalAssetBreakdownData[]
        native: NativeAssetBreakdownData[]
      }
    > = {}
    for (const amount of tokenAmounts.amounts) {
      const config = configMapping.getAmountConfig(amount.configId)
      if (config.untilTimestamp?.lt(targetTimestamp)) {
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

      const priceConfig = configMapping.getPriceConfigFromAmountConfig(config)
      if (prices.excluded.has(priceConfig.configId)) {
        continue
      }
      const price = pricesMap.get(priceConfig.configId)
      assert(price, 'Price not found for id ' + priceConfig.configId)

      const amountAsNumber = asNumber(amount.amount, config.decimals)
      const valueAsNumber = amountAsNumber * price

      switch (config.source) {
        case 'canonical': {
          // The canonical logic is the most complex one
          assert(
            config.type === 'escrow' || config.type === 'preminted',
            'Only escrow or preminted tokens can be canonical',
          )
          const asset = breakdown.canonical.get(priceConfig.assetId)
          if (asset) {
            asset.usdValue += valueAsNumber
            asset.amount += amountAsNumber
            asset.escrows.push({
              amount: amountAsNumber.toString(),
              usdValue: valueAsNumber.toString(),
              escrowAddress: config.escrowAddress,
              ...(config.type === 'preminted' ? { isPreminted: true } : {}),
            })
          } else {
            breakdown.canonical.set(priceConfig.assetId, {
              assetId: priceConfig.assetId,
              chainId: chainConverter.toChainId(config.chain),
              amount: amountAsNumber,
              usdValue: valueAsNumber,
              usdPrice: price.toString(),
              escrows: [
                {
                  amount: amountAsNumber.toString(),
                  usdValue: valueAsNumber.toString(),
                  escrowAddress: config.escrowAddress,
                  ...(config.type === 'preminted' ? { isPreminted: true } : {}),
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
            chainId: chainConverter.toChainId(config.chain),
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
            chainId: chainConverter.toChainId(config.chain),
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

    return { dataTimestamp: targetTimestamp, breakdowns: result }
  }
}
