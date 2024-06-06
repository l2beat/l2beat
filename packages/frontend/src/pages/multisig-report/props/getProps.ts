import { Config } from '../../../build/config'
import { Wrapped } from '../../Page'
import { getDefaultPageMetadata } from '../../metadata'
import { MultisigReportPageProps } from '../view/MultisigReportPage'

export function getProps(config: Config): Wrapped<MultisigReportPageProps> {
  return {
    props: {
      showActivity: config.features.activity,
      multisigReportUrl: config.links.multisigReport,
    },
    wrapper: {
      metadata: getDefaultPageMetadata({
        image: 'https://l2beat.com/images/announcements/multisig-report-og.png',
        url: 'https://l2beat.com/multisig-report',
      }),
      banner: config.features.banner,
    },
  }
}
