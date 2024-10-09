import { type ConfigMapping, safeGetTokenByAssetId } from '@l2beat/config'
import {
  assert,
  type AssetId,
  type EthereumAddress,
  type ProjectId,
  UnixTime,
  asNumber,
  assertUnreachable,
} from '@l2beat/shared-pure'
import { assignTokenMetaToBreakdown } from './assign-token-meta-to-breakdown'
import { chainConverter } from './chain-converter'
import { getLatestAmountForConfigurations } from './get-latest-amount-for-configurations'
import { getLatestPriceForConfigurations } from './get-latest-price-for-configurations'
import { recordToSortedBreakdown } from './record-to-sorted-breakdown'
import { type BreakdownRecord, type CanonicalAssetBreakdownData } from './types'

const SHARED_ESCROW_WARNING =
  'Does not account for differences in locked value due to pending deposits and withdrawals.'

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
            config.type === 'escrow' ||
              config.type === 'preminted' ||
              config.type === 'aggLayerL2Token' ||
              config.type === 'aggLayerNativeEtherPreminted' ||
              config.type === 'aggLayerNativeEtherWrapped' ||
              config.type === 'elasticChainL2Token' ||
              config.type === 'elasticChainEther',
            'Only escrow, preminted, AggLayer, Elastic tokens can be canonical',
          )

          let isSharedEscrow
          switch (config.type) {
            case 'aggLayerL2Token':
            case 'aggLayerNativeEtherPreminted':
            case 'aggLayerNativeEtherWrapped':
            case 'elasticChainL2Token':
            case 'elasticChainEther':
              isSharedEscrow = true
              break
            case 'escrow':
            case 'preminted':
              isSharedEscrow = false
              break
            default:
              assertUnreachable(config)
          }

          const asset = breakdown.canonical.get(priceConfig.assetId)
          if (asset) {
            asset.usdValue += valueAsNumber
            asset.amount += amountAsNumber
            asset.escrows.push({
              amount: amountAsNumber,
              usdValue: valueAsNumber,
              escrowAddress: config.escrowAddress,
              ...(config.type === 'preminted' ? { isPreminted: true } : {}),
              warning: isSharedEscrow ? SHARED_ESCROW_WARNING : undefined,
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
                  warning: isSharedEscrow ? SHARED_ESCROW_WARNING : undefined,
                },
              ],
            })
          }
          break
        }
        case 'external': {
          const token = safeGetTokenByAssetId(priceConfig.assetId)

          let address: EthereumAddress | 'native'
          switch (config.type) {
            case 'aggLayerL2Token':
            case 'elasticChainL2Token':
              address = config.l1Address
              break
            case 'aggLayerNativeEtherPreminted':
            case 'aggLayerNativeEtherWrapped':
            case 'elasticChainEther':
              address = 'native'
              break
            default:
              address = config.address
          }

          breakdown.external.push({
            assetId: priceConfig.assetId,
            chainId: chainConverter.toChainId(config.chain),
            amount: amountAsNumber,
            usdValue: valueAsNumber,
            usdPrice: price.toString(),
            tokenAddress: address === 'native' ? undefined : address,
            bridgedUsing: config.bridgedUsing ?? {
              bridges: token?.bridgedUsing?.bridges ?? [{ name: 'Unknown' }],
              warning: token?.bridgedUsing?.warning,
            },
          })
          break
        }
        case 'native': {
          let address: EthereumAddress | 'native'
          switch (config.type) {
            case 'aggLayerL2Token':
            case 'elasticChainL2Token':
              address = config.l1Address
              break
            case 'aggLayerNativeEtherPreminted':
            case 'aggLayerNativeEtherWrapped':
            case 'elasticChainEther':
              address = 'native'
              break
            default:
              address = config.address
          }

          breakdown.native.push({
            assetId: priceConfig.assetId,
            chainId: chainConverter.toChainId(config.chain),
            amount: amountAsNumber,
            usdValue: valueAsNumber,
            usdPrice: price.toString(),
            // TODO: force fe to accept "native"
            tokenAddress: address === 'native' ? undefined : address,
          })
        }
      }
    }

    const sortedBreakdown = recordToSortedBreakdown(breakdown)
    const breakdownWithTokenInfo = assignTokenMetaToBreakdown(sortedBreakdown)

    return {
      dataTimestamp: targetTimestamp.toNumber(),
      breakdown: breakdownWithTokenInfo,
    }
  }
}
