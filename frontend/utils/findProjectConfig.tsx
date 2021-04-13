import { assert } from 'ts-essentials'

import { dataPipelineConfig } from '../data'

export function findProjectConfig(name: string): any {
  const projectConfigFull = Object.entries(dataPipelineConfig.l2s).find(
    ([projectName]) => projectName.toLowerCase() === name.toLowerCase(),
  )
  assert(projectConfigFull, `Couldn't find ${name} in projects config`)

  const [, projectConfig] = projectConfigFull as any
  return projectConfig
}
