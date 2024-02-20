// eslint-disable-next-line @typescript-eslint/ban-types
export interface ProjectId extends String {
  _ProjectIdBrand: string
}

export function ProjectId(value: string): ProjectId {
  if (value === '') {
    throw new TypeError('Invalid ProjectId')
  }
  return value as unknown as ProjectId
}

ProjectId.ETHEREUM = ProjectId('ethereum')
ProjectId.ARBITRUM = ProjectId('arbitrum')
