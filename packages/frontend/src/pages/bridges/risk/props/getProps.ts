import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getDefaultPageMetadata } from '../../../metadata'
import { Wrapped } from '../../../Page'
import { BridgesPagesData } from '../../types'
import { BridgesRiskPageProps } from '../view/BridgesRiskPage'
import { getBridgesRiskView } from './getBridgesRiskView'

export function getProps(
  config: Config,
  pagesData: BridgesPagesData,
): Wrapped<BridgesRiskPageProps> {
  return {
    props: {
      navbar: getNavbarProps(config, 'bridges'),
      riskView: getBridgesRiskView(
        [...config.bridges, ...config.layer2s],
        pagesData,
      ),
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: getDefaultPageMetadata({
        image: 'https://l2beat.com/meta-images/overview-bridges.png',
        url: 'https://l2beat.com/bridges/risk',
      }),
      banner: config.features.banner,
    },
  }
}
