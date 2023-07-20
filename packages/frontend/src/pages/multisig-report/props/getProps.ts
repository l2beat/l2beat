import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { Wrapped } from '../../Page'
import { MultisigReportPageProps } from '../view/MultisigReportPage'
import { getPageMetadata } from './getPageMetadata'

export function getProps(config: Config): Wrapped<MultisigReportPageProps> {
  return {
    props: {
      navbar: {
        ...getNavbarProps(config, 'multisig-report'),
        showMultisigReport: false,
      },
      footer: getFooterProps(config),
      showActivity: config.features.activity,
      multisigReportUrl: config.links.multisigReport,
    },
    wrapper: {
      metadata: getPageMetadata(),
    },
  }
}
