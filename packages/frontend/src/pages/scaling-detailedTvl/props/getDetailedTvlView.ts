import { Layer2 } from '@l2beat/config'

import { Config } from '../../../build/config'
import { isAnySectionUnderReview } from '../../../utils/project/isAnySectionUnderReview'
import { getRiskValues } from '../../../utils/risks/values'
import { DetailedTvlViewEntry } from '../types'
import { DetailedTvlViewProps } from '../view/DetailedTvlView'

export function getDetailedTvlView(
  config: Config,
  projects: Layer2[],
): DetailedTvlViewProps {
  return {
    items: projects.map((project) => getDetailedTvlViewEntry(project)),
    upcomingEnabled: config.features.upcomingRollups,
  }
}

function getDetailedTvlViewEntry(
  project: Layer2,
  isVerified?: boolean,
): DetailedTvlViewEntry {
  return {
    name: project.display.name,
    slug: project.display.slug,
    provider: project.display.provider,
    riskValues: getRiskValues(project.riskView),
    warning: project.display.warning,
    isArchived: project.isArchived,
    showProjectUnderReview: isAnySectionUnderReview(project),
    isUpcoming: project.isUpcoming,
    isVerified,
    tvl: '111',
    cbv: '222',
    ebv: '333',
    nmv: '444',
    oneDayChange: '+1.23%',
    sevenDayChange: `+${(Math.random() * 100).toFixed(2)}%`,
  }
}
