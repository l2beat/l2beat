import { getL2ApiEntries } from '~/server/features/layer2s/summary/getL2ApiEntries'
import { getTvsChart } from '~/server/features/layer2s/tvs/getTvsChartData'
import { optionToRange } from '~/utils/range/range'

export async function getL2SummaryApiData() {
  const [entries, data] = await Promise.all([
    getL2ApiEntries(),
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
