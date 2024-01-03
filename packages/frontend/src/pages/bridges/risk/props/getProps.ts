import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { Wrapped } from '../../../Page'
import { BridgesPagesData } from '../../types'
import { BridgesRiskPageProps } from '../view/BridgesRiskPage'
import { getBridgesRiskView } from './getBridgesRiskView'
import { getPageMetadata } from './getPageMetadata'

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
      metadata: getPageMetadata(),
      banner: config.features.banner,
    },
  }
}
