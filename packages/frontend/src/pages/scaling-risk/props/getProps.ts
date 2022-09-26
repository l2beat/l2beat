import { ApiMain } from '@l2beat/types'

import { Config } from '../../../build/config'
import { getFooterProps } from '../../../components'
import { getSocialLinksProps } from '../../../components/navbar/SocialLinks'
import { getIncludedProjects } from '../../../utils/getIncludedProjects'
import { orderByTvl } from '../../../utils/orderByTvl'
import { Wrapped } from '../../Page'
import { RiskPageProps } from '../view/RiskPage'
import { getPageMetadata } from './getPageMetadata'
import { getRiskView } from './getRiskView'

export function getProps(
  config: Config,
  apiMain: ApiMain,
): Wrapped<RiskPageProps> {
  const included = getIncludedProjects(config.layer2s, apiMain)
  const ordering = orderByTvl(included, apiMain)

  return {
    props: {
      navbar: {
        showBanner: config.features.banner,
        socialLinks: getSocialLinksProps(config),
      },
      riskView: getRiskView(ordering),
      footer: getFooterProps(config),
    },
    wrapper: {
      preloadApi: '/api/tvl.json',
      metadata: getPageMetadata(),
    },
  }
}
