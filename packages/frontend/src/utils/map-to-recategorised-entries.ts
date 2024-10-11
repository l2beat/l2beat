import { type StageConfig } from '@l2beat/config'
import { type ProjectId } from '@l2beat/shared-pure'
import { getProjectsLatestTvlUsd } from '~/server/features/scaling/tvl/utils/get-latest-tvl-usd'
import { orderByStageAndTvl } from '~/server/features/scaling/utils/order-by-stage-and-tvl'
import { groupByMainCategories } from './group-by-main-categories'

export async function mapToRecategorisedEntries<
  T extends {
    id: ProjectId
    name: string
    stage: StageConfig
    category: string | undefined
  },
>(entries: T[]) {
  const tvl = await getProjectsLatestTvlUsd()
  return groupByMainCategories(orderByStageAndTvl(entries, tvl))
}
