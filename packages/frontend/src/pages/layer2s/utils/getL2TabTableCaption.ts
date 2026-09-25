import { getTabTableCaption } from '~/components/table/getTabTableCaption'
import type { CommonL2Entry } from '~/server/features/layer2s/getCommonL2Entry'

const L2_TAB_LABELS: Record<CommonL2Entry['tab'], string> = {
  rollups: 'Rollups',
  validiumsAndOptimiums: 'Validiums & Optimiums',
  others: 'Others',
}

export function getL2TabTableCaption(
  subject: string,
  tab: CommonL2Entry['tab'],
) {
  return getTabTableCaption(subject, L2_TAB_LABELS[tab])
}
