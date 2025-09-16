import type { Project } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
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
    circulatingSupply: {
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
    logo: token.iconUrl ?? getStaticAsset('/images/token-placeholder.png'),
    name: token.name,
    symbol: token.symbol,
    description: ecosystem.ecosystemConfig.token.description,
    data: {
      price: {
        value: ecosystemToken.priceUsd,
        change: ecosystemToken.price7dChange,
      },
      marketCap: {
        value: ecosystemToken.marketCapUsd,
        change: ecosystemToken.marketCap7dChange,
      },
      circulatingSupply: {
        value: ecosystemToken.circulatingSupply,
        change: ecosystemToken.circulatingSupply7dChange,
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
      circulatingSupply: {
        value: 813245.67,
        change: -2.34,
      },
    },
  }
}
