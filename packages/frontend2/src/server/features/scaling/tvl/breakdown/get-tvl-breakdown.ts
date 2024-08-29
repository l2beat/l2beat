import { type ConfigMapping, safeGetTokenByAssetId } from '@l2beat/config'
import {
  assert,
  type AssetId,
  type ProjectId,
  UnixTime,
  asNumber,
} from '@l2beat/shared-pure'
import { assignTokenMetaToBreakdown } from './assign-token-meta-to-breakdown'
import { chainConverter } from './chain-converter'
import { getLatestAmountForConfigurations } from './get-latest-amount-for-configurations'
import { getLatestPriceForConfigurations } from './get-latest-price-for-configurations'
import { recordToSortedBreakdown } from './record-to-sorted-breakdown'
import { type BreakdownRecord, type CanonicalAssetBreakdownData } from './types'

export function getTvlBreakdown(configMapping: ConfigMapping) {
  return async function (projectId: ProjectId, target?: UnixTime) {
    const targetTimestamp =
      target ?? UnixTime.now().toStartOf('hour').add(-2, 'hours')

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

    const breakdown: BreakdownRecord = {
      canonical: new Map<AssetId, CanonicalAssetBreakdownData>(),
      external: [],
      native: [],
    }

    for (const amount of tokenAmounts.amounts) {
      const config = configMapping.getAmountConfig(amount.configId)

      if (config.project !== projectId) {
        throw new Error(
          `Project id mismatch. Expected ${projectId}, got ${config.project}. Double check amounts mappings.`,
        )
      }

      if (config.untilTimestamp?.lt(targetTimestamp)) {
        continue
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
              amount: amountAsNumber,
              usdValue: valueAsNumber,
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
                  amount: amountAsNumber,
                  usdValue: valueAsNumber,
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
            amount: amountAsNumber,
            usdValue: valueAsNumber,
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
            amount: amountAsNumber,
            usdValue: valueAsNumber,
            usdPrice: price.toString(),
            // TODO: force fe to accept "native"
            tokenAddress:
              config.address === 'native' ? undefined : config.address,
          })
      }
    }

    const sortedBreakdown = recordToSortedBreakdown(breakdown)
    const breakdownWithTokenInfo = assignTokenMetaToBreakdown(sortedBreakdown)

    return { dataTimestamp: targetTimestamp, breakdown: breakdownWithTokenInfo }
  }
}
