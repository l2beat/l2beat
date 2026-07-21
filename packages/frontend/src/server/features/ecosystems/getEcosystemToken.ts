import type { Project } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import type { PercentageChangePeriod } from '~/utils/calculatePercentageChange'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'

export interface EcosystemToken {
  logo: string
  name: string
  symbol: string
  description: string
  data: {
    price: {
      value: number
      change: number
      changePeriod: PercentageChangePeriod
    }
    marketCap: {
      value: number
      change: number
      changePeriod: PercentageChangePeriod
    }
    circulatingSupply: {
      value: number
      change: number
      changePeriod: PercentageChangePeriod
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
  projects: Project<never, 'tvsConfig'>[],
): Promise<EcosystemToken> => {
  const db = getDb()

  const token = projects
    .flatMap((e) => e.tvsConfig)
    .find((t) => t?.priceId === ecosystem.ecosystemConfig.token.coingeckoId)
  assert(token, 'Token not found')

  const ecosystemToken = await db.ecosystemToken.findByCoingeckoId(
    ecosystem.ecosystemConfig.token.coingeckoId,
  )

  assert(ecosystemToken, 'No ecosystem token found')

  return {
    logo: token.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL,
    name: token.name,
    symbol: token.symbol,
    description: ecosystem.ecosystemConfig.token.description,
    data: {
      price: {
        value: ecosystemToken.priceUsd,
        change: ecosystemToken.price7dChange,
        changePeriod: '7D',
      },
      marketCap: {
        value: ecosystemToken.marketCapUsd,
        change: ecosystemToken.marketCap7dChange,
        changePeriod: '7D',
      },
      circulatingSupply: {
        value: ecosystemToken.circulatingSupply,
        change: ecosystemToken.circulatingSupply7dChange,
        changePeriod: '7D',
      },
    },
  }
}

function getMockEcosystemToken(
  ecosystem: Project<'ecosystemConfig'>,
): EcosystemToken {
  return {
    logo: TOKEN_PLACEHOLDER_ICON_URL,
    name: 'Mock Token',
    symbol: 'MOCK',
    description: ecosystem.ecosystemConfig.token.description,
    data: {
      price: {
        value: 1.23,
        change: 5.67,
        changePeriod: '7D',
      },
      marketCap: {
        value: 1000000,
        change: 8.9,
        changePeriod: '7D',
      },
      circulatingSupply: {
        value: 813245.67,
        change: -2.34,
        changePeriod: '7D',
      },
    },
  }
}
