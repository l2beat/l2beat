export interface ProjectId extends String {
  _ProjectIdBrand: string
}

export function ProjectId(value: string): ProjectId {
  if (value === '') {
    throw new TypeError('Invalid ProjectId')
  }
  return value as unknown as ProjectId
}

ProjectId.ALL = ProjectId('l2beat-all')
ProjectId.LAYER2S = ProjectId('l2beat-layer2s')
ProjectId.BRIDGES = ProjectId('l2beat-bridges')
ProjectId.ZKSYNC = ProjectId('zksync')
ProjectId.ETHEREUM = ProjectId('ethereum')
ProjectId.LOOPRING = ProjectId('loopring')
