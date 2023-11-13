import { Layer2 } from '@l2beat/config'
import { LivenessApiResponse } from '@l2beat/shared-pure'

import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { orderByTvl } from '../../../../utils/orderByTvl'
import { PagesData, Wrapped } from '../../../Page'
import { ScalingLivenessPageProps } from '../view/ScalingLivenessPage'
import { getPageMetadata } from './getPageMetadata'
import { getScalingLivenessView } from './getScalingLivenessView'

export function getProps(
  config: Config,
  pagesData: PagesData,
): Wrapped<ScalingLivenessPageProps> {
  const { tvlApiResponse, livenessApiResponse } = pagesData
  const included = getIncludedProjects(config.layer2s, livenessApiResponse)
  const ordering = orderByTvl(included, tvlApiResponse)

  return {
    props: {
      livenessView: getScalingLivenessView(ordering, livenessApiResponse),
      navbar: getNavbarProps(config, 'scaling'),
      footer: getFooterProps(config),
      showActivity: config.features.activity,
    },
    wrapper: {
      banner: config.features.banner,
      metadata: getPageMetadata(),
    },
  }
}

function getIncludedProjects(
  projects: Layer2[],
  livenessResponse: LivenessApiResponse | undefined,
) {
  return projects.filter(
    (p) =>
      livenessResponse?.projects[p.display.slug] &&
      !p.isUpcoming &&
      !p.isArchived,
  )
}
