export interface ProjectId extends String {
  _ProjectIdBrand: string
}

export function ProjectId(value: string) {
  if (value === '') {
    throw new TypeError('Invalid ProjectId')
  }
  return value as unknown as ProjectId
}

ProjectId.ALL = ProjectId('l2beat-all')
