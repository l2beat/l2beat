import type { Logger } from '@l2beat/backend-tools'
import { INTEROP_CHAINS } from '@l2beat/config'
import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { notUndefined } from '@l2beat/shared-pure'
import { manifest } from '~/utils/Manifest'
import type { ChainData, CommonInteropData, DurationSplitMap } from '../types'
import { getAverageDuration } from './getAverageDuration'

type Params = {
  projectId: string
  bridgeType: KnownInteropBridgeType | undefined
  chains: Map<string, CommonInteropData>
  durationSplitMap: DurationSplitMap | undefined
  logger: Logger
}

export function getChainsData({
  projectId,
  bridgeType,
  chains,
  durationSplitMap,
  logger,
}: Params): ChainData[] {
  return Array.from(chains.entries())
    .map(([chainId, chainData]) => {
      const chain = INTEROP_CHAINS.find((c) => c.id === chainId)
      if (!chain) {
        logger.warn(`Chain not found: ${chainId}`)
        return undefined
      }

      const avgDuration = getAverageDuration(
        projectId,
        bridgeType,
        chainData,
        durationSplitMap,
      )

      return {
        id: chainId,
        name: chain.name,
        iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
        volume: chainData.volume,
        transferCount: chainData.transferCount,
        avgDuration: avgDuration,
        avgValue: Math.floor(chainData.volume / chainData.transferCount),
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
