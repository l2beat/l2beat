import type { ProjectDefiTvlChain } from '@l2beat/config'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'

export interface DefiTvlProjectConfig {
  configurationId: string
  projectId: ProjectId
  protocolSlug: string
  sinceTimestamp: UnixTime
  chains: ProjectDefiTvlChain[]
}

export interface DefiTvlConfig {
  apiUrl: string
  projects: DefiTvlProjectConfig[]
}
