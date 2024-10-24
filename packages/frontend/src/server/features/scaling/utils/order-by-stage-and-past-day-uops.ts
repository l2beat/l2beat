import { type StageConfig } from '@l2beat/config'
import { type ProjectId } from '@l2beat/shared-pure'

export function orderByStageAndPastDayUops<
  T extends {
    id: ProjectId
    name: string
    stage: StageConfig
    data: {
      pastDayUops: number
    }
  },
>(projects: T[]): T[] {
  const sortByStageAndTps = (a: T, b: T) => {
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

    const aTps = a.data.pastDayUops
    const bTps = b.data.pastDayUops
    if (aTps !== bTps) {
      return bTps - aTps
    }

    return a.name.localeCompare(b.name)
  }

  return projects.sort(sortByStageAndTps)
}
