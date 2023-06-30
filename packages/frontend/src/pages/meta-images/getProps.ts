import { Bridge, Layer2 } from '@l2beat/config'
import { ActivityApiResponse, TvlApiResponse } from '@l2beat/shared-pure'

import { getTpsDaily } from '../../utils/activity/getTpsDaily'
import { formatUSD, getPercentageChange } from '../../utils/utils'
import { Wrapped } from '../Page'
import { ActivityMetaImageProps } from './ActivityMetaImage'
import { TvlMetaImageProps } from './TvlMetaImage'

// where should this be placed? we already have it in backend code
export function assert(
  condition: unknown,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message ? `Assertion Error: ${message}` : 'Assertion Error')
  }
}

export function getProps(
  tvlApiResponse: TvlApiResponse,
  project: Layer2 | Bridge | undefined,
  type: 'layers2s' | 'bridges',
): Wrapped<TvlMetaImageProps> {
  const daily = project
    ? tvlApiResponse.projects[project.id.toString()]?.charts.daily.data ?? []
    : tvlApiResponse[type].daily.data
  const tvl = daily.at(-1)?.[1] ?? 0
  const tvlSevenDaysAgo = daily.at(-8)?.[1] ?? 0
  const sevenDayChange = getPercentageChange(tvl, tvlSevenDaysAgo)

  const apiPath = project
    ? `${project.display.slug}-tvl`
    : type === 'layers2s'
    ? 'scaling-tvl'
    : 'bridges-tvl'

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

export function getPropsActivity(
  activityApiResponse: ActivityApiResponse,
): Wrapped<ActivityMetaImageProps> {
  const activityData = activityApiResponse.combined.data
  const activityNow = getTpsDaily(activityData)
  assert(activityNow, "Can't get current daily TPS")
  const activitySevenDaysAgo = getTpsDaily(activityData, 8)
  assert(activitySevenDaysAgo, "Can't get past daily TPS")
  const weeklyChange = getPercentageChange(activityNow, activitySevenDaysAgo)

  const activityEndpoint = `/api/activity/combined.json`
  return {
    props: {
      tpsDaily: activityNow.toFixed(2),
      tpsWeeklyChange: weeklyChange,
      activityEndpoint,
    },
    wrapper: {
      htmlClassName: 'light meta',
      metadata: { title: 'Meta Image', description: '', image: '', url: '' },
      preloadApi: activityEndpoint,
    },
  }
}
