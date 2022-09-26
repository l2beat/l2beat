import { ProjectRiskViewEntry } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { Config } from '../../build/config'
import { getFooterProps, getNavbarProps } from '../../components'
import { getIncludedProjects } from '../../utils/getIncludedProjects'
import { orderByTvl } from '../../utils/orderByTvl'
import { Wrapped } from '../Page'
import { BridgesRiskPageProps } from './BridgesRiskPage'
import { BridgesRiskViewEntry } from './BridgesRiskView'

export function getProps(
  config: Config,
  apiMain: ApiMain,
): Wrapped<BridgesRiskPageProps> {
  const included = getIncludedProjects(config.bridges, apiMain)
  const ordering = orderByTvl(included, apiMain)
  return {
    props: {
      navbar: getNavbarProps(config),
      riskView: {
        items: ordering.map(
          (bridge): BridgesRiskViewEntry => ({
            name: bridge.display.name,
            slug: bridge.display.slug,
            type: bridge.technology.type,
            destination: getDestination(bridge.technology.destination),
            ...bridge.riskView,
          }),
        ),
      },
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: {
        description: '',
        image: '',
        title: '',
        url: '',
      },
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
  return { value: 'Multichain', description: destinations.join(', ') }
}
