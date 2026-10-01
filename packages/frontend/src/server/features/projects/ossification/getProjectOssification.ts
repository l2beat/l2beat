import {
  measureOssification,
  type OssificationInput,
  type ProjectOssificationCriticalUpdate,
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
  ossification?: OssificationInput
}

export async function getProjectOssification(
  project: OssificationProject,
): Promise<ProjectOssificationView | undefined> {
  if (!env.CLIENT_SIDE_OSSIFICATION_ENABLED || !project.ossification) {
    return undefined
  }

  const now = UnixTime.now()
  const ossification = measureOssification(project.ossification, now)
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
