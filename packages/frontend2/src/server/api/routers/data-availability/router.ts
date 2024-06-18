import { layer2s } from '@l2beat/config/build/src/projects/layer2s'
import {
  type DaEconomicSecurityType,
  DaLayerKindDisplay,
  daEconomicSecurityMeta,
  daLayers,
} from '@l2beat/config/build/src/projects/other/da-beat'
import { notUndefined } from '@l2beat/shared-pure'

import { procedure, router } from '~/server/api/trpc'
import { toDaBridge } from './utils/get-da-bridge'
import { getDaRisks } from './utils/get-da-risks'

export const dataAvailabilityRouter = router({
  summary: procedure.query(async ({ ctx: { db } }) => {
    // TODO: It's probably better to not fetch all data at once
    const stakes = Object.fromEntries(
      (await db.stake.findMany()).map((s) => [s.id, s.thresholdStake]),
    )

    const currentPrices = Object.fromEntries(
      (await db.currentPrice.findMany()).map((p) => [
        p.coingeckoId,
        p.priceUsd,
      ]),
    )

    function getEconomicSecurity(type: DaEconomicSecurityType) {
      const thresholdStake = stakes[type]

      if (!thresholdStake) {
        return { status: 'StakeNotSynced' as const }
      }

      const currentPrice = daEconomicSecurityMeta[type]
        ? currentPrices[daEconomicSecurityMeta[type].coingeckoId]
        : undefined

      if (!currentPrice) {
        return { status: 'CurrentPriceNotSynced' as const }
      }

      return {
        status: 'Synced' as const,
        economicSecurity: (thresholdStake * BigInt(currentPrice * 100)) / 100n,
      }
    }

    return daLayers.flatMap((daLayer) =>
      daLayer.bridges.map((bridge) => ({
        slug: daLayer.display.slug,
        daLayer: daLayer.display.name,
        daBridge: toDaBridge(bridge),
        risks: getDaRisks(daLayer, bridge),
        tvs: Math.random() * 1_000_000_000,
        economicSecurity:
          daLayer.kind === 'PublicBlockchain' && daLayer.economicSecurity
            ? getEconomicSecurity(daLayer.economicSecurity.type)
            : undefined,
        layerType: DaLayerKindDisplay[daLayer.kind],
        // TODO: maybe we can specify names in the config instead of projectIds
        usedBy: bridge.usedIn
          .map(
            (projectId) =>
              layer2s.find((l2) => l2.id === projectId)?.display.name,
          )
          .filter(notUndefined),
      })),
    )
  }),

  risk: procedure.query(async () => {
    return daLayers.flatMap((daLayer) =>
      daLayer.bridges.map((bridge) => ({
        slug: daLayer.display.slug,
        daLayer: daLayer.display.name,
        daBridge: toDaBridge(bridge),
        risks: getDaRisks(daLayer, bridge),
      })),
    )
  }),
})
