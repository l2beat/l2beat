import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { PagesData, Wrapped } from '../../../Page'
import { BridgesRiskPageProps } from '../view/BridgesRiskPage'
import { getBridgesRiskView } from './getBridgesRiskView'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  config: Config,
  pagesData: PagesData,
): Wrapped<BridgesRiskPageProps> {
  const { tvlApiResponse, verificationStatus } = pagesData

  return {
    props: {
      navbar: getNavbarProps(config, 'bridges'),
      riskView: getBridgesRiskView(
        [...config.bridges, ...config.layer2s],
        tvlApiResponse,
        verificationStatus,
      ),
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: getPageMetadata(),
      banner: config.features.banner,
    },
  }
}
