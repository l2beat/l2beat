import type {
  ProjectOssification,
  ProjectOssificationCriticalUpdate,
} from '@l2beat/shared/frontend'
import { type ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import {
  getOssificationStats,
  type OssificationStats,
  type OssificationStatsProject,
} from './getOssificationStats'

export interface ProjectOssificationView extends OssificationStats {
  contracts: OssificationContractView[]
  criticalUpdates: ProjectOssificationCriticalUpdate[]
}

export interface OssificationContractView {
  name: string
  address: ChainSpecificAddress
  isVerified: boolean
  ageSeconds: number
  codeChangeCount: number
  stateChangeCount: number
}

interface OssificationProject extends OssificationStatsProject {
  ossification?: ProjectOssification
}

export async function getProjectOssification(
  project: OssificationProject,
): Promise<ProjectOssificationView | undefined> {
  const { ossification } = project
  if (!env.CLIENT_SIDE_OSSIFICATION_ENABLED || !ossification) {
    return undefined
  }

  const now = UnixTime.now()
  return {
    ...(await getOssificationStats(project, ossification, now)),
    contracts: ossification.contracts.map(
      ({ ossifyingSince, ...contract }) => ({
        ...contract,
        ageSeconds: now - ossifyingSince,
      }),
    ),
    criticalUpdates: ossification.criticalUpdates,
  }
}
