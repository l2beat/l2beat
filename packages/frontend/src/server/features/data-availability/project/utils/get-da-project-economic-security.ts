import type { DaLayer } from '@l2beat/config'
import { round } from 'lodash'
import { env } from '~/env'
import { getDb } from '~/server/database'

export type EconomicSecurityData =
  | {
      status: 'Synced'
      economicSecurity: number
    }
  | {
      status: 'StakeNotSynced' | 'CurrentPriceNotSynced'
    }

export async function getDaProjectEconomicSecurity(daLayer: DaLayer) {
  if (env.MOCK) {
    return getMockDaProjectEconomicSecurity(daLayer)
  }
  const db = getDb()

  if (
    !(
      daLayer.kind === 'PublicBlockchain' || daLayer.kind === 'EthereumDaLayer'
    ) ||
    !daLayer.economicSecurity
  ) {
    return undefined
  }

  const stake = await db.stake.findById(daLayer.economicSecurity.name)
  if (!stake) {
    return { id: daLayer.id, status: 'StakeNotSynced' as const }
  }

  const coingeckoId = daLayer.economicSecurity.token.coingeckoId
  const currentPrice = await db.currentPrice.findByCoingeckoId(coingeckoId)
  if (!currentPrice) {
    return { id: daLayer.id, status: 'CurrentPriceNotSynced' as const }
  }

  return {
    status: 'Synced' as const,
    // We're intentionally trading precision for ease of use in Client Components
    economicSecurity:
      Number(
        (stake.thresholdStake * BigInt(round(currentPrice.priceUsd * 100))) /
          100n,
      ) /
      10 ** daLayer.economicSecurity.token.decimals,
  }
}

function getMockDaProjectEconomicSecurity(daLayer: DaLayer) {
  return {
    id: daLayer.id,
    status: 'Synced' as const,
    economicSecurity: 100,
  }
}
