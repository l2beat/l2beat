import type { CropOssification } from '~/components/garden/crops'
import type { OssificationStats } from '../projects/ossification/getOssificationStats'
import { getProjectOssification } from '../projects/ossification/getProjectOssification'

/** Undefined unless the ossification feature is on and the project is opted in. */
export async function getCropOssification(
  project: Parameters<typeof getProjectOssification>[0],
): Promise<CropOssification | undefined> {
  const ossification = await getProjectOssification(project)
  return ossification && toCropOssification(ossification)
}

export function toCropOssification(stats: OssificationStats): CropOssification {
  return {
    score: stats.score,
    isUnverified: stats.isUnverified,
    unchangedSince: stats.timeline.clockStart,
    exposure: stats.exposure,
  }
}
