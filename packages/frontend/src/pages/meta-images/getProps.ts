import { Layer2 } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { formatUSD, getPercentageChange } from '../../utils/utils'
import { Wrapped } from '../Page'
import { MetaImageProps } from './MetaImage'

export function getProps(
  apiMain: ApiMain,
  project?: Layer2,
): Wrapped<MetaImageProps> {
  const daily = project
    ? apiMain.projects[project.id.toString()]?.charts.daily.data ?? []
    : apiMain.layers2s.daily.data
  const tvl = daily.at(-1)?.[1] ?? 0
  const tvlSevenDaysAgo = daily.at(-8)?.[1] ?? 0
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  const apiEndpoint = `/api/${project?.slug ?? 'tvl'}.json`
  return {
    props: {
      tvl: formatUSD(tvl),
      sevenDayChange,
      name: project?.name,
      icon: project && `/icons/${project.slug}.png`,
      apiEndpoint,
    },
    wrapper: {
      htmlClassName: 'light meta',
      metadata: { title: 'Meta Image', description: '', image: '', url: '' },
      preloadApi: apiEndpoint,
    },
  }
}
