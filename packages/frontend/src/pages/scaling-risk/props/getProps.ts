import { Layer2 } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { orderByTvl } from '../../../utils/orderByTvl'
import { Wrapped } from '../../Page'
import { RiskPageProps } from '../view/RiskPage'
import { getPageMetadata } from './getPageMetadata'
import { getRiskView } from './getRiskView'

export function getProps(
  projects: Layer2[],
  apiMain: ApiMain,
): Wrapped<RiskPageProps> {
  const ordering = orderByTvl(projects, apiMain)
  return {
    props: {
      riskView: getRiskView(ordering),
    },
    wrapper: {
      preloadApi: '/api/tvl.json',
      metadata: getPageMetadata(),
    },
  }
}
