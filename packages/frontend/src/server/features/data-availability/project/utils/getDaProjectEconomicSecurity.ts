import type { DaEconomicSecurity } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import round from 'lodash/round'
import { env } from '~/env'
import { getDb } from '~/server/database'

export async function getDaProjectEconomicSecurity(
  projectId: ProjectId,
  economicSecurity: DaEconomicSecurity | undefined,
): Promise<number | undefined> {
  if (!economicSecurity) {
    return undefined
  }

  if (env.MOCK) {
    return 100
  }
  const db = getDb()
  const coingeckoId = economicSecurity.token.coingeckoId

  const [stake, currentPrice] = await Promise.all([
    db.daBeatStats.findById(projectId),
    db.currentPrice.findByCoingeckoId(coingeckoId),
  ])
  if (!stake || !currentPrice) {
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
