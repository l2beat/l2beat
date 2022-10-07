import { Layer2 } from '@l2beat/config'
import { TvlApiResponse } from '@l2beat/types'

import { formatUSD, getPercentageChange } from '../../utils/utils'
import { Wrapped } from '../Page'
import { MetaImageProps } from './MetaImage'

export function getProps(
  tvlApiResponse: TvlApiResponse,
  project?: Layer2,
): Wrapped<MetaImageProps> {
  const daily = project
    ? tvlApiResponse.projects[project.id.toString()]?.charts.daily.data ?? []
    : tvlApiResponse.layers2s.daily.data
  const tvl = daily.at(-1)?.[1] ?? 0
  const tvlSevenDaysAgo = daily.at(-8)?.[1] ?? 0
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  const apiPath = project ? `${project.display.slug}-tvl` : 'scaling-tvl'

  const tvlEndpoint = `/api/${apiPath}.json`
  return {
    props: {
      tvl: formatUSD(tvl),
      sevenDayChange,
      name: project?.display.name,
      icon: project && `/icons/${project.display.slug}.png`,
      tvlEndpoint,
    },
    wrapper: {
      htmlClassName: 'light meta',
      metadata: { title: 'Meta Image', description: '', image: '', url: '' },
      preloadApi: tvlEndpoint,
    },
  }
}
