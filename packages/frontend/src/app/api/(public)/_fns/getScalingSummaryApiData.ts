import { getScalingApiEntries } from 'rewrite/src/server/features/scaling/summary/get-scaling-api-entries'
import { getTvsChart } from 'rewrite/src/server/features/scaling/tvs/get-tvs-chart-data'

export async function getScalingSummaryApiData() {
  const [entries, data] = await Promise.all([
    getScalingApiEntries(),
    getTvsChart({
      range: '30d',
      excludeAssociatedTokens: false,
      filter: { type: 'layer2' },
      previewRecategorisation: false,
    }),
  ])
  return {
    chart: {
      types: ['timestamp', 'native', 'canonical', 'external', 'ethPrice'],
      data: data.map(([timestamp, native, canonical, external, ethPrice]) => [
        timestamp,
        native,
        canonical,
        external,
        ethPrice,
      ]),
    },
    projects: Object.fromEntries(entries.map((entry) => [entry.id, entry])),
  }
}
