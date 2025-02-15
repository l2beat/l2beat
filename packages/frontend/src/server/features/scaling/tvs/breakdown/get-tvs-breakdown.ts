import type { ConfigMapping } from '@l2beat/backend-shared'
import type { ChainConfig } from '@l2beat/config'
import { safeGetTokenByAssetId } from '@l2beat/config'
import type {
  AmountConfigEntry,
  AssetId,
  EthereumAddress,
  ProjectId,
} from '@l2beat/shared-pure'
import {
  assert,
  ChainConverter,
  ChainId,
  UnixTime,
  asNumber,
  assertUnreachable,
} from '@l2beat/shared-pure'
import { assignTokenMetaToBreakdown } from './assign-token-meta-to-breakdown'
import { getLatestAmountForConfigurations } from './get-latest-amount-for-configurations'
import { getLatestPriceForConfigurations } from './get-latest-price-for-configurations'
import { recordToSortedBreakdown } from './record-to-sorted-breakdown'
import type { BreakdownRecord, CanonicalAssetBreakdownData } from './types'

export function getTvsBreakdown(
  configMapping: ConfigMapping,
  chains: ChainConfig[],
) {
  return async function (projectId: ProjectId, target?: UnixTime) {
    const chainConverter = new ChainConverter(
      chains.map((c) => ({ name: c.name, chainId: ChainId(c.chainId) })),
    )

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
          const address = getTokenAddress(config)
          const isSharedEscrow = getIsSharedEscrow(config)
          assert(
            config.type !== 'totalSupply' &&
              config.type !== 'circulatingSupply',
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
              isSharedEscrow,
            })
          } else {
            breakdown.canonical.set(priceConfig.assetId, {
              assetId: priceConfig.assetId,
              /*
               * We are taking chain from price because there is an edge case in which
               * chain from amount config is different for frontend and backend purposes.
               * E.g. Elastic chain and AggLayer where we have shared escrows.
               */
              chainId: chainConverter.toChainId(priceConfig.chain),
              amount: amountAsNumber,
              usdValue: valueAsNumber,
              usdPrice: price.toString(),
              tokenAddress: address === 'native' ? undefined : address,
              escrows: [
                {
                  amount: amountAsNumber,
                  usdValue: valueAsNumber,
                  escrowAddress: config.escrowAddress,
                  ...(config.type === 'preminted' ? { isPreminted: true } : {}),
                  isSharedEscrow,
                },
              ],
            })
          }
          break
        }
        case 'external': {
          const token = safeGetTokenByAssetId(priceConfig.assetId)
          const address = getTokenAddress(config)

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
          const address = getTokenAddress(config)
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

function getIsSharedEscrow(config: AmountConfigEntry) {
  switch (config.type) {
    case 'aggLayerL2Token':
    case 'aggLayerNativeEtherPreminted':
    case 'aggLayerNativeEtherWrapped':
    case 'elasticChainL2Token':
    case 'elasticChainEther':
      return true
    case 'escrow':
    case 'preminted':
      return false
    case 'circulatingSupply':
    case 'totalSupply':
      throw new Error(
        `Only escrow configs should be passed there ${config.assetId}`,
      )
    default:
      assertUnreachable(config)
  }
}

function getTokenAddress(
  config: AmountConfigEntry & { configId: string },
): EthereumAddress | 'native' {
  switch (config.type) {
    case 'aggLayerL2Token':
    case 'elasticChainL2Token':
      return config.l1Address
    case 'aggLayerNativeEtherPreminted':
    case 'aggLayerNativeEtherWrapped':
    case 'elasticChainEther':
      return 'native'
    default:
      return config.address
  }
}
