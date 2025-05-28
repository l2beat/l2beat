import type { Project } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import keyBy from 'lodash/keyBy'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import { getDb } from '~/server/database'

export interface BlobsData {
  totalData: number
  blobsShare: number
}

export async function getBlobsData(
  projects: Project<'scalingInfo'>[],
): Promise<BlobsData> {
  if (env.MOCK) {
    return getMockBlobsData()
  }
  return getCachedBlobsData(projects)
}

const getCachedBlobsData = cache(
  async (projects: Project<'scalingInfo'>[]): Promise<BlobsData> => {
    const now = UnixTime.toStartOf(UnixTime.now(), 'day') - UnixTime.DAY

    const db = getDb()
    const records = await db.dataAvailability.getForDaLayerByTimestamp(
      ProjectId.ETHEREUM,
      now,
    )

    const ethereumRecord = records.find(
      (record) => record.projectId === ProjectId.ETHEREUM,
    )
    if (!ethereumRecord) {
      return {
        totalData: 0,
        blobsShare: 0,
      }
    }

    const recordsByProjectId = keyBy(records, (e) => e.projectId)

    const totalData = projects.reduce((acc, project) => {
      const projectRecord = recordsByProjectId[project.id]
      if (!projectRecord) {
        return acc
      }
      return acc + Number(projectRecord.totalSize)
    }, 0)

    const blobsShare = totalData / Number(ethereumRecord.totalSize)

    return {
      totalData,
      blobsShare,
    }
  },
  ['blobs-data'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)

function getMockBlobsData(): BlobsData {
  return {
    totalData: 1000000,
    blobsShare: 0.15,
  }
}
