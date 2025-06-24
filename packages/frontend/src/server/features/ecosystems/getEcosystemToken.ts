import type { Project } from '@l2beat/config'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { getStaticAsset } from '../utils/getProjectIcon'

export interface EcosystemToken {
  logo: string
  name: string
  symbol: string
  description: string
  data: {
    price: {
      value: number
      change: number
    }
    marketCap: {
      value: number
      change: number
    }
    amount: {
      value: number
      change: number
    }
  }
}
export async function getEcosystemToken(
  ecosystem: Project<'ecosystemConfig'>,
  ecosystemProjects: Project<never, 'tvsConfig'>[],
): Promise<EcosystemToken> {
  if (env.MOCK) {
    return getMockEcosystemToken(ecosystem)
  }
  return await getCachedEcosystemToken(ecosystem, ecosystemProjects)
}

const getCachedEcosystemToken = async (
  ecosystem: Project<'ecosystemConfig'>,
  ecosystemProjects: Project<never, 'tvsConfig'>[],
): Promise<EcosystemToken> => {
  const db = getDb()
  const now = UnixTime.toStartOf(UnixTime.now(), 'hour')

  const tokenProject = ecosystemProjects.find(
    (p) => p.id === ecosystem.ecosystemConfig.token.projectId,
  )
  assert(tokenProject, 'Token project not found')
  assert(tokenProject.tvsConfig, 'Token project has no TVL config')
  const token = tokenProject.tvsConfig.find(
    (t) => t.id === ecosystem.ecosystemConfig.token.tokenId,
  )
  assert(token, 'Token not found')

  const [prices, tokenValues] = await Promise.all([
    db.tvsPrice.getPricesInRangeByPriceId(
      token.priceId,
      now - 30 * UnixTime.DAY,
      now,
    ),
    db.tvsTokenValue.getByTokenIdInTimeRange(
      ecosystem.ecosystemConfig.token.tokenId,
      now - 30 * UnixTime.DAY,
      now,
    ),
  ])
  const latestTokenValue = tokenValues.at(-1)
  const firstTokenValue = tokenValues.at(0)
  assert(latestTokenValue && firstTokenValue, 'No token values found')
  const latestPrice = prices.at(-1)
  const firstPrice = prices.at(0)
  assert(latestPrice && firstPrice, 'No prices found')

  const priceChange = calculatePercentageChange(
    latestPrice.priceUsd,
    firstPrice.priceUsd,
  )
  const amountChange = calculatePercentageChange(
    latestTokenValue.amount,
    firstTokenValue.amount,
  )
  const marketCapChange = calculatePercentageChange(
    latestTokenValue.value,
    firstTokenValue.value,
  )

  return {
    logo: token.iconUrl ?? getStaticAsset('/images/token-placeholder.png'),
    name: token.name,
    symbol: token.symbol,
    description: ecosystem.ecosystemConfig.token.description,
    data: {
      price: {
        value: latestPrice.priceUsd,
        change: priceChange,
      },
      marketCap: {
        value: latestTokenValue.value,
        change: marketCapChange,
      },
      amount: {
        value: latestTokenValue.amount,
        change: amountChange,
      },
    },
  }
}

function getMockEcosystemToken(
  ecosystem: Project<'ecosystemConfig'>,
): EcosystemToken {
  return {
    logo: getStaticAsset('/images/token-placeholder.png'),
    name: 'Mock Token',
    symbol: 'MOCK',
    description: ecosystem.ecosystemConfig.token.description,
    data: {
      price: {
        value: 1.23,
        change: 5.67,
      },
      marketCap: {
        value: 1000000,
        change: 8.9,
      },
      amount: {
        value: 813245.67,
        change: -2.34,
      },
    },
  }
}
