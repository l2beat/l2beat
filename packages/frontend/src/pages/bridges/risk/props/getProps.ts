import { Config } from '../../../../build/config'
import { Wrapped } from '../../../Page'
import { getDefaultPageMetadata } from '../../../metadata'
import { BridgesPagesData } from '../../types'
import { BridgesRiskPageProps } from '../view/BridgesRiskPage'
import { getBridgesRiskView } from './getBridgesRiskView'

export function getProps(
  config: Config,
  pagesData: BridgesPagesData,
): Wrapped<BridgesRiskPageProps> {
  return {
    props: {
      riskView: getBridgesRiskView(
        [...config.bridges, ...config.layer2s],
        pagesData,
      ),
    },
    wrapper: {
      metadata: getDefaultPageMetadata({
        image: 'https://l2beat.com/meta-images/pages/og-bridges-risks.png',
        url: 'https://l2beat.com/bridges/risk',
      }),
      banner: config.features.banner,
    },
  }
}
