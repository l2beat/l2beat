import { type StageConfig } from '@l2beat/config'
import { type ProjectId } from '@l2beat/shared-pure'

export function orderByStageAndTvl<
  T extends {
    id: ProjectId
    name: string
    stage: StageConfig
  },
>(projects: T[], tvls: Record<ProjectId, number>): T[] {
  const getTvl = (project: T) => tvls[project.id] ?? 0

  const sortByStageAndTvl = (a: T, b: T) => {
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

    const aTvl = getTvl(a)
    const bTvl = getTvl(b)
    if (aTvl !== bTvl) {
      return bTvl - aTvl
    }

    return a.name.localeCompare(b.name)
  }

  return projects.sort(sortByStageAndTvl)
}
