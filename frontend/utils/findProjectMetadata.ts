import { assert } from 'ts-essentials'

import { projectsMetaData } from '../data'

export function findProjectMetadata(name: string): any {
  const projectMetadataFull = Object.entries(projectsMetaData).find(
    ([projectName]) => projectName.toLowerCase() === name.toLowerCase(),
  )
  assert(projectMetadataFull, `Couldn't find ${name} in projects metadata config`)

  const [, projectMeta] = projectMetadataFull as any
  return projectMeta
}
