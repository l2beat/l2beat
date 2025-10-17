import { getScalingApiEntries } from '~/server/features/scaling/summary/getScalingApiEntries'
import { getTvsChart } from '~/server/features/scaling/tvs/getTvsChartData'

export async function getScalingSummaryApiData() {
  const [entries, data] = await Promise.all([
    getScalingApiEntries(),
    getTvsChart({
      range: { type: '30d' },
      excludeAssociatedTokens: false,
      includeRwaRestrictedTokens: false,
      filter: { type: 'layer2' },
    }),
  ])
  return {
    chart: {
      types: ['timestamp', 'native', 'canonical', 'external', 'ethPrice'],
      data: data.chart.map(
        ([timestamp, native, canonical, external, ethPrice]) => [
          timestamp,
          native,
          canonical,
          external,
          ethPrice,
        ],
      ),
      syncedUntil: data.syncedUntil,
    },
    projects: Object.fromEntries(entries.map((entry) => [entry.id, entry])),
  }
}
