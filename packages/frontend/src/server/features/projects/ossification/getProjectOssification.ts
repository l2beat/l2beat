import type {
  ProjectOssification,
  ProjectOssificationCriticalUpdate,
} from '@l2beat/config'
import { type ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { calculateExposure } from './calculateExposure'
import {
  getOssificationSeries,
  type OssificationSeries,
  type OssificationSeriesProject,
  type OssificationValueSource,
} from './getOssificationSeries'

/** Shared by the detail block and the ossification table. */
export interface OssificationStats {
  score: number
  isUnverified: boolean
  projectAgeSeconds: number
  lastChangeAgeSeconds: number
  criticalChangesPerYear: number
  clusteredEventCount: number
  /** USD·years; null without a value series */
  exposure: number | null
  valueSource: OssificationValueSource | null
}

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

export interface OssificationProject extends OssificationSeriesProject {
  ossification?: ProjectOssification
}

export async function getProjectOssification(
  project: OssificationProject,
): Promise<ProjectOssificationView | undefined> {
  const { ossification } = project
  if (!ossification) {
    return undefined
  }

  const now = UnixTime.now()
  const series = await getOssificationSeries(
    project,
    ossification.projectClockStart,
  )

  return {
    ...getOssificationStats(ossification, series, now),
    contracts: ossification.contracts.map(
      ({ ossifyingSince, ...contract }) => ({
        ...contract,
        ageSeconds: now - ossifyingSince,
      }),
    ),
    criticalUpdates: ossification.criticalUpdates,
  }
}

export function getOssificationStats(
  ossification: ProjectOssification,
  series: OssificationSeries | null,
  now: UnixTime,
): OssificationStats {
  const clockStart = ossification.projectClockStart
  const isUnverified = ossification.contracts.some((c) => !c.isVerified)
  return {
    score: ossification.score,
    isUnverified,
    projectAgeSeconds: now - clockStart,
    lastChangeAgeSeconds: now - (ossification.lastCriticalChange ?? clockStart),
    criticalChangesPerYear: ossification.criticalChangesPerYear,
    clusteredEventCount: ossification.clusteredEventCount,
    exposure: isUnverified
      ? 0
      : series
        ? calculateExposure(series.points, clockStart, now)
        : null,
    valueSource: series?.source ?? null,
  }
}
