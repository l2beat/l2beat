import { ProjectRiskViewEntry } from '@l2beat/config'
import { TvlApiResponse } from '@l2beat/types'

import { Config } from '../../build/config'
import { getFooterProps, getNavbarProps } from '../../components'
import { getIncludedProjects } from '../../utils/getIncludedProjects'
import { orderByTvl } from '../../utils/orderByTvl'
import { Wrapped } from '../Page'
import { BridgesRiskPageProps } from './BridgesRiskPage'
import { BridgesRiskViewEntry } from './BridgesRiskView'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  config: Config,
  tvlApiResponse: TvlApiResponse,
): Wrapped<BridgesRiskPageProps> {
  const included = getIncludedProjects(
    [...config.bridges, ...config.layer2s],
    tvlApiResponse,
  )
  const ordering = orderByTvl(included, tvlApiResponse)

  return {
    props: {
      navbar: getNavbarProps(config, 'bridges'),
      riskView: {
        items: ordering.map(
          (project): BridgesRiskViewEntry => ({
            type: project.type,
            name: project.display.name,
            slug: project.display.slug,
            warning: project.display.warning,
            category: project.technology.category,
            destination: getDestination(
              project.type === 'bridge'
                ? project.technology.destination
                : [project.display.name],
            ),
            ...project.riskView,
          }),
        ),
      },
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: getPageMetadata(),
    },
  }
}

function getDestination(destinations: string[]): ProjectRiskViewEntry {
  if (destinations.length === 0) {
    throw new Error('Invalid destination')
  }
  if (destinations.length === 1) {
    return { value: destinations[0], description: '' }
  }
  if (destinations.length === 2) {
    return { value: destinations.join(', '), description: '' }
  }
  return { value: 'Various', description: destinations.join(',\n') }
}
