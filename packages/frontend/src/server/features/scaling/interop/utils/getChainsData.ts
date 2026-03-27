import type { Logger } from '@l2beat/backend-tools'
import type { InteropDurationSplit } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { manifest } from '~/utils/Manifest'
import type { ChainData, CommonInteropData } from '../types'
import { getAverageDuration } from './getAverageDuration'
import { getInteropChains } from './getInteropChains'

type Params = {
  chains: Map<string, CommonInteropData>
  durationSplit: InteropDurationSplit | undefined
  logger: Logger
}

export function getChainsData({
  chains,
  logger,
  durationSplit,
}: Params): ChainData[] {
  const interopChains = getInteropChains()
  return Array.from(chains.entries())
    .map(([chainId, chainData]) => {
      const chain = interopChains.find((c) => c.id === chainId)
      if (!chain) {
        logger.warn(`Chain not found: ${chainId}`)
        return undefined
      }

      const avgDuration = getAverageDuration(chainData, durationSplit)

      return {
        id: chainId,
        name: chain.name,
        iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
        volume: chainData.volume,
        transferCount: chainData.transferCount,
        avgDuration: avgDuration,
        avgValue: Math.floor(chainData.volume / chainData.transferCount),
        minTransferValueUsd: chainData.minTransferValueUsd,
        maxTransferValueUsd: chainData.maxTransferValueUsd,
        netMintedValue:
          chainData.mintedValueUsd !== undefined &&
          chainData.burnedValueUsd !== undefined
            ? chainData.mintedValueUsd - chainData.burnedValueUsd
            : undefined,
      }
    })
    .filter(notUndefined)
    .toSorted((a, b) => b.volume - a.volume)
}
