import { getLayer2sApiEntries } from '~/server/features/layer2s/summary/getLayer2sApiEntries'
import { getTvsChart } from '~/server/features/layer2s/tvs/getTvsChartData'
import { optionToRange } from '~/utils/range/range'

export async function getLayer2sSummaryApiData() {
  const [entries, data] = await Promise.all([
    getLayer2sApiEntries(),
    getTvsChart({
      range: optionToRange('30d'),
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: true,
      filter: { type: 'layer2' },
    }),
  ])
  return {
    chart: {
      types: ['timestamp', 'native', 'canonical', 'external', 'ethPrice'],
      data: data.chart,
      syncedUntil: data.syncedUntil,
    },
    projects: Object.fromEntries(entries.map((entry) => [entry.id, entry])),
  }
}
