import millify from 'millify'

import { THIRTY_DAYS_IN_MILLIS } from '../components/graphs/Graph'
import { Card, Props } from '../components/og/Card'
import { l2Data } from '../data'
import { dateSorter } from '../utils/dateSorter'

export default function OGImage(props: Props) {
  console.log(l2Data, props)
  return <Card {...props} />
}

export async function getStaticProps(): Promise<{ props: Props }> {
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
        { name: 'Tracked projects', value: Object.keys(l2Data.l2s).length.toString() },
        { name: '24h change', value: change, icon: trendIcon },
        { name: 'Date', value: new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' }).format(new Date(last.date)) },
      ],
      graphData: ThirtyDaysData,
    },
  }
}
