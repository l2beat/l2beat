import { ApiMain } from '@l2beat/types'

import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getIncludedProjects } from '../../../utils/getIncludedProjects'
import { orderByTvl } from '../../../utils/orderByTvl'
import { Wrapped } from '../../Page'
import { BridgesTvlPageProps } from '../BridgesTvlPage'
import { getBridgesTvlView } from './getFinancialView'

export function getProps(
  config: Config,
  apiMain: ApiMain,
): Wrapped<BridgesTvlPageProps> {
  const included = getIncludedProjects(config.bridges, apiMain)
  const ordering = orderByTvl(included, apiMain)
  const tvl = apiMain.bridges.hourly.data.at(-1)?.[1] ?? 0
  return {
    props: {
      navbar: getNavbarProps(config),
      tvlView: {
        items: getBridgesTvlView(ordering, apiMain, tvl),
      },
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: {
        description: '',
        image: '',
        title: '',
        url: '',
      },
    },
  }
}
