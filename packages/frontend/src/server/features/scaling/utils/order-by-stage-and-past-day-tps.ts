import { type StageConfig } from '@l2beat/config'
import { type ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'

interface BaseProject {
  id: ProjectId
  name: string
  stage: StageConfig
  data: {
    pastDayTps: number
  }
}

export function orderByStageAndPastDayTps<T extends BaseProject>(
  projects: T[],
): T[] {
  if (!env.NEXT_PUBLIC_FEATURE_FLAG_STAGE_SORTING) {
    return projects.sort(sortByTps)
  }

  return projects.sort(sortByStageAndTps)
}

const sortByStageAndTps = <T extends BaseProject>(a: T, b: T) => {
  const stageA = a.stage.stage
  const stageB = b.stage.stage

  if (stageA === 'Stage 2' || stageA === 'Stage 1') {
    if (stageB !== 'Stage 2' && stageB !== 'Stage 1') return -1
  } else if (stageB === 'Stage 2' || stageB === 'Stage 1') {
    return 1
  } else if (stageA === 'Stage 0') {
    if (stageB !== 'Stage 0') return -1
  } else if (stageB === 'Stage 0') {
    return 1
  }

  const aTps = a.data.pastDayTps
  const bTps = b.data.pastDayTps
  if (aTps !== bTps) {
    return bTps - aTps
  }

  return a.name.localeCompare(b.name)
}

export const sortByTps = <T extends BaseProject>(a: T, b: T) => {
  const aTps = a.data.pastDayTps
  const bTps = b.data.pastDayTps
  if (aTps !== bTps) {
    return bTps - aTps
  }

  return a.name.localeCompare(b.name)
}
