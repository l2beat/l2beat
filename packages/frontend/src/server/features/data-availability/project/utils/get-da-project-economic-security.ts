import type { DaEconomicSecurity } from '@l2beat/config'
import { round } from 'lodash'
import { env } from '~/env'
import { getDb } from '~/server/database'

export async function getDaProjectEconomicSecurity(
  economicSecurity: DaEconomicSecurity | undefined,
): Promise<number | undefined> {
  if (!economicSecurity) {
    return undefined
  }

  if (env.MOCK) {
    return 100
  }
  const db = getDb()

  const stake = await db.stake.findById(economicSecurity.name)
  if (!stake) {
    return undefined
  }

  const coingeckoId = economicSecurity.token.coingeckoId
  const currentPrice = await db.currentPrice.findByCoingeckoId(coingeckoId)
  if (!currentPrice) {
    return undefined
  }

  return (
    Number(
      (stake.thresholdStake * BigInt(round(currentPrice.priceUsd * 100))) /
        100n,
    ) /
    10 ** economicSecurity.token.decimals
  )
}
