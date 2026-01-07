import type { Branded } from './branded.js'

export type ProjectId = Branded<string, 'ProjectId'>

export function ProjectId(value: string): ProjectId {
  if (value === '') {
    throw new TypeError('Invalid ProjectId')
  }
  return value as unknown as ProjectId
}

ProjectId.ETHEREUM = ProjectId('ethereum')
