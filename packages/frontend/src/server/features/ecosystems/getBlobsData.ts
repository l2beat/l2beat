import type { Project } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import keyBy from 'lodash/keyBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { sumByResolutionAndProject } from '../data-availability/throughput/utils/sumByResolutionAndProject'

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
  return await getCachedBlobsData(projects)
}

const getCachedBlobsData = async (
  projects: Project<'scalingInfo'>[],
): Promise<BlobsData> => {
  const now = UnixTime.toStartOf(UnixTime.now(), 'day')

  const db = getDb()
  const records = await db.dataAvailability.getForDaLayerInTimeRange(
    ProjectId.ETHEREUM,
    now - UnixTime.DAY,
    now,
  )
  const summedRecords = sumByResolutionAndProject(records, 'daily')

  const ethereumRecord = summedRecords.find(
    (record) => record.projectId === ProjectId.ETHEREUM,
  )
  if (!ethereumRecord) {
    return {
      totalData: 0,
      blobsShare: 0,
    }
  }

  const recordsByProjectId = keyBy(summedRecords, (e) => e.projectId)

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
}

function getMockBlobsData(): BlobsData {
  return {
    totalData: 1000000,
    blobsShare: 0.15,
  }
}
