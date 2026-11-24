import { ProjectId, type UnixTime } from '@l2beat/shared-pure'
import type {
  BaseProject,
  ProjectDefiTvlConfig,
  ProjectLiquidStakingTracking,
} from '../types'

export interface LiquidStakingListing {
  /** Also the slug. The icon goes in `packages/frontend/static/icons/<id>.png`. */
  id: string
  name: string
  shortName?: string
  addedAt: UnixTime
  /**
   * Without it, the TVL shows as no data. `source: 'l2beat'` reads a tvs.json
   * next to the project file.
   */
  tvl?: ProjectDefiTvlConfig
  /** Without it, the yield and the cost of exit show as no data. */
  tracking?: ProjectLiquidStakingTracking
}

/**
 * A liquid staking protocol research hasn't reviewed: a row of the liquid
 * staking page with the numbers it tracks, and no project page.
 */
export function liquidStakingListing(
  listing: LiquidStakingListing,
): BaseProject {
  return {
    id: ProjectId(listing.id),
    slug: listing.id,
    name: listing.name,
    shortName: listing.shortName,
    addedAt: listing.addedAt,
    defiInfo: {
      category: 'Liquid Staking',
      ...(listing.tvl && { tvl: listing.tvl }),
    },
    liquidStaking: {
      ...(listing.tracking && { tracking: listing.tracking }),
    },
  }
}
