import { type StageConfig } from '@l2beat/config'
import { type ProjectId } from '@l2beat/shared-pure'
import { orderByStageAndTvl } from '~/server/features/scaling/utils/order-by-stage-and-tvl'
import { groupByMainCategories } from './group-by-main-categories'

export function mapToRecategorisedEntries<
  T extends {
    id: ProjectId
    name: string
    stage: StageConfig
    category: string | undefined
  },
>(entries: T[], tvl: {
  [k: string]: number;
}) {
  return groupByMainCategories(orderByStageAndTvl(entries, tvl))
}
