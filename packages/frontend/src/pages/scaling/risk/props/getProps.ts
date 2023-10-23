import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getIncludedProjects } from '../../../../utils/getIncludedProjects'
import { orderByTvl } from '../../../../utils/orderByTvl'
import { PagesData, Wrapped } from '../../../Page'
import { ScalingRiskPageProps } from '../view/ScalingRiskPage'
import { getPageMetadata } from './getPageMetadata'
import { getScalingRiskView } from './getScalingRiskView'

export function getProps(
  config: Config,
  pagesData: PagesData,
): Wrapped<ScalingRiskPageProps> {
  const { tvlApiResponse, verificationStatus } = pagesData

  const included = getIncludedProjects(config.layer2s, tvlApiResponse)
  const ordering = orderByTvl(included, tvlApiResponse)

  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      riskView: getScalingRiskView(ordering, verificationStatus),
      footer: getFooterProps(config),
      showActivity: config.features.activity,
    },
    wrapper: {
      metadata: getPageMetadata(),
      banner: config.features.banner,
    },
  }
}
