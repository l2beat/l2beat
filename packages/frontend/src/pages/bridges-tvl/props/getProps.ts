import { ApiMain } from '@l2beat/types'

import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getIncludedProjects } from '../../../utils/getIncludedProjects'
import { orderByTvl } from '../../../utils/orderByTvl'
import { formatUSD, getPercentageChange } from '../../../utils/utils'
import { Wrapped } from '../../Page'
import { BridgesTvlPageProps } from '../BridgesTvlPage'
import { getBridgesTvlView } from './getBridgesTvlView'

export function getProps(
  config: Config,
  apiMain: ApiMain,
): Wrapped<BridgesTvlPageProps> {
  const tvl = apiMain.bridges.hourly.data.at(-1)?.[1] ?? 0
  const tvlSevenDaysAgo = apiMain.bridges.hourly.data[0]?.[1] ?? 0
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  const included = getIncludedProjects(config.bridges, apiMain)
  const ordering = orderByTvl(included, apiMain)

  return {
    props: {
      navbar: getNavbarProps(config),
      tvl: formatUSD(tvl),
      sevenDayChange,
      apiEndpoint: '/api/bridges-tvl.json',
      tvlView: {
        items: getBridgesTvlView(ordering, apiMain, tvl),
      },
      footer: getFooterProps(config),
    },
    wrapper: {
      preloadApi: '/api/bridges-tvl.json',
      metadata: {
        description: '',
        image: '',
        title: '',
        url: '',
      },
    },
  }
}
