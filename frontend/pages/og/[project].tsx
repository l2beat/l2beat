import l2Data from '@l2beat/backend'
import millify from 'millify'

import { THIRTY_DAYS_IN_MILLIS } from '../../components/graphs/Graph'
import { Card, Props } from '../../components/og/Card'
import { dateSorter } from '../../utils/dateSorter'
import { findProjectMetadata } from '../../utils/findProjectMetadata'
import { getProjectsPaths } from '../../utils/getProjectPaths'

export default function OGImage(props: Props) {
  return <Card {...props} />
}

export function getStaticPaths() {
  return getProjectsPaths(['overview'])
}

export async function getStaticProps(params: { params: { project: string } }): Promise<{ props: Props }> {
  if (params.params.project === 'overview') {
    return getStaticPropsForOverviewPage() as any
  }

  const [name, projectData] = Object.entries(l2Data.l2s).find(
    ([projectName]) => projectName.toLowerCase() === params.params.project,
  )!

  const projectMetadata = findProjectMetadata(params.params.project)

  const projectTvlData = projectData.data.sort(dateSorter).reverse()

  const last = projectTvlData[0]
  const millis30DaysAgo = Date.now() - THIRTY_DAYS_IN_MILLIS
  const ThirtyDaysData = projectTvlData
    .filter((point: { date: string }) => new Date(point.date).getTime() > millis30DaysAgo)
    .map((point: { date: string; usd: number }) => ({ x: new Date(point.date).getTime(), y: point.usd }))

  const change = ((projectTvlData[0].usd / projectTvlData[1].usd) * 100 - 100).toFixed(2)

  const trendIcon = Number(change) === 0 ? 'flat' : Number(change) > 0 ? 'up' : 'down'

  return {
    props: {
      bg: projectMetadata.color,
      title: name,
      head: 'L2BEAT',
      stats: [
        { name: 'TVL', value: `$${millify(projectData.TVL)}` },
        { name: '24h change', value: change, icon: trendIcon },
        { name: 'Date', value: new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' }).format(new Date(last.date)) },
      ],
      graphData: ThirtyDaysData,
    },
  }
}

function getStaticPropsForOverviewPage() {
  const tvlData = l2Data.data.sort(dateSorter).reverse()

  const last = tvlData[0]
  const millis30DaysAgo = Date.now() - THIRTY_DAYS_IN_MILLIS
  const ThirtyDaysData = tvlData
    .filter((point: { date: string }) => new Date(point.date).getTime() > millis30DaysAgo)
    .map((point: { date: string; usd: number }) => ({ x: new Date(point.date).getTime(), y: point.usd }))
  const change = ((tvlData[0].usd / tvlData[1].usd) * 100 - 100).toFixed(2)

  const trendIcon = Number(change) === 0 ? 'flat' : Number(change) > 0 ? 'up' : 'down'

  return {
    props: {
      bg: '#13BEB4',
      title: 'L2BEAT',
      head: 'Overview',
      stats: [
        { name: 'TVL', value: `$${millify(l2Data.TVL)}` },
        { name: 'Projects', value: Object.keys(l2Data.l2s).length.toString() },
        { name: '24h change', value: change, icon: trendIcon },
        { name: 'Date', value: new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' }).format(new Date(last.date)) },
      ],
      graphData: ThirtyDaysData,
    },
  }
}
