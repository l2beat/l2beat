import { assert } from 'ts-essentials'

import { projectsMetaData } from '../data'

export function findProjectMetadata(name: string) {
  const projectMetadataFull = Object.entries(projectsMetaData).find(
    ([projectName]) => projectName.toLowerCase() === name.toLowerCase(),
  )
  assert(projectMetadataFull, `Couldn't find ${name} in projects metadata config`)
  return projectMetadataFull[1]
}
