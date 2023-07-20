import { Config } from '../../build/config'
import { getFooterProps, getNavbarProps } from '../../components'
import { getDestination } from '../../utils/getDestination'
import { getIncludedProjects } from '../../utils/getIncludedProjects'
import { orderByTvl } from '../../utils/orderByTvl'
import { isAnySectionUnderReview } from '../../utils/project/isAnySectionUnderReview'
import { PagesData, Wrapped } from '../Page'
import { BridgesRiskPageProps } from './BridgesRiskPage'
import { getPageMetadata } from './getPageMetadata'
import { BridgesRiskViewEntry } from './types'

export function getProps(
  config: Config,
  pagesData: PagesData,
): Wrapped<BridgesRiskPageProps> {
  const { tvlApiResponse, verificationStatus } = pagesData

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
            isArchived: project.isArchived,
            showProjectUnderReview: isAnySectionUnderReview(project),
            isVerified: verificationStatus.projects[project.id.toString()],
            category: project.display.category,
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
