import { CoingeckoId, UnixTime } from '@l2beat/common'

import { Token } from '../../model/Token'
import { PriceRepository } from '../../peripherals/database/PriceRepository'

interface PriceStatus {
  coingeckoId: CoingeckoId
  min: string
  max: string
  message: string
}

export class StatusController {
  constructor(
    private priceRepository: PriceRepository,
    private tokens: Token[],
  ) {}

  async getPricesStatus() {
    const boundaries = await this.priceRepository.calcDataBoundaries()

    const result: PriceStatus[] = []

    for (const token of this.tokens) {
      const boundary = boundaries.get(token.coingeckoId)

      if (!boundary) {
        result.push({
          coingeckoId: token.coingeckoId,
          min: '',
          max: '',
          message: '!!! no prices !!!',
        })
        continue
      }

      result.push({
        coingeckoId: token.coingeckoId,
        min: unixTimeToString(boundary.earliest),
        max: unixTimeToString(boundary.latest),
        message: calculateOutOfSync(boundary.latest),
      })
    }
    return result
  }
}

const unixTimeToString = (date: UnixTime) => {
  return date.toDate().toString().slice(4, 21)
}

const SECONDS_PER_HOUR = 60 * 60
const calculateOutOfSync = (date: UnixTime): string => {
  const now = UnixTime.now().add(-1, 'hours').toStartOf('hour')

  const diff = now.toNumber() - date.toNumber()

  if (diff === 0) {
    return '✔'
  }

  if (diff < 24 * SECONDS_PER_HOUR) {
    return `out of sync for ${diff / SECONDS_PER_HOUR} hour(s)`
  }

  if (diff >= 24 * SECONDS_PER_HOUR) {
    return `out of sync for ${Math.floor(
      diff / (24 * SECONDS_PER_HOUR),
    )} day(s)`
  }
  return ''
}
