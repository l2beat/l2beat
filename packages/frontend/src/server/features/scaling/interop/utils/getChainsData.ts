import type { Logger } from '@l2beat/backend-tools'
import { INTEROP_CHAINS } from '@l2beat/config'
import type { InteropBridgeType } from '@l2beat/shared-pure'
import { notUndefined } from '@l2beat/shared-pure'
import { manifest } from '~/utils/Manifest'
import type { AverageDurationData, ChainData, DurationSplitMap } from '../types'
import { getAverageDuration } from './getAverageDuration'

type Params = {
  projectId: string
  bridgeType: InteropBridgeType | undefined
  chains: Map<
    string,
    AverageDurationData & {
      volume: number
    }
  >
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
      }
    })
    .filter(notUndefined)
    .toSorted((a, b) => b.volume - a.volume)
}
