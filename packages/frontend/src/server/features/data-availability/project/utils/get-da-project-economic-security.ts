import type { DaLayer } from '@l2beat/config'
import { round } from 'lodash'
import { env } from '~/env'
import { getDb } from '~/server/database'

export async function getDaProjectEconomicSecurity(
  daLayer: DaLayer,
): Promise<number | undefined> {
  if (env.MOCK) {
    return 100
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
    return undefined
  }

  const coingeckoId = daLayer.economicSecurity.token.coingeckoId
  const currentPrice = await db.currentPrice.findByCoingeckoId(coingeckoId)
  if (!currentPrice) {
    return undefined
  }

  const economicSecurity =
    Number(
      (stake.thresholdStake * BigInt(round(currentPrice.priceUsd * 100))) /
        100n,
    ) /
    10 ** daLayer.economicSecurity.token.decimals
  return economicSecurity
}
