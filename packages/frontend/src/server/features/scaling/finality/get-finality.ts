import { type Layer2FinalityConfig } from '@l2beat/config'
import { assert, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { keyBy, mapValues } from 'lodash'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { type FinalityData, type FinalityDataPoint } from './schema'

export type FinalityProjectConfig = {
  projectId: ProjectId
} & Layer2FinalityConfig

export async function getFinality(projects: FinalityProjectConfig[]) {
  if (env.MOCK) {
    return getMockFinalityData(projects)
  }

  return getFinalityData(projects)
}

async function getFinalityData(projects: FinalityProjectConfig[]) {
  const db = getDb()
  const projectIds = projects.map((p) => p.projectId)
  const records = await db.finality.getLatestGroupedByProjectId(projectIds)

  const result: FinalityData = mapValues(
    keyBy(records, 'projectId'),
    (record) => {
      const {
        averageStateUpdate,

        minimumTimeToInclusion,
        averageTimeToInclusion,
        maximumTimeToInclusion,

        projectId,
        timestamp,
      } = record

      const base = {
        syncedUntil: timestamp.toNumber(), // cache serialization, will be coerced to UnixTime
        timeToInclusion: {
          minimumInSeconds: minimumTimeToInclusion,
          maximumInSeconds: maximumTimeToInclusion,
          averageInSeconds: averageTimeToInclusion,
        },
      }

      const project = projects.find(
        (project) => project.projectId === projectId,
      )

      assert(project, 'Project not found in config')

      if (project.stateUpdate === 'zeroed') {
        return {
          ...base,
          stateUpdateDelays: {
            averageInSeconds: 0,
          },
        }
      }

      if (project.stateUpdate === 'disabled') {
        return {
          ...base,
          stateUpdateDelays: null,
        }
      }

      const hasStateUpdateDelay = averageStateUpdate !== null

      const stateUpdateDelays = hasStateUpdateDelay
        ? {
            averageInSeconds: averageStateUpdate,
          }
        : null

      return {
        ...base,
        stateUpdateDelays,
      }
    },
  )

  return result
}

function getMockFinalityData(projects: FinalityProjectConfig[]): FinalityData {
  const result = projects.reduce<FinalityData>((acc, cur) => {
    acc[cur.projectId.toString()] = {
      timeToInclusion: generateMockData(),
      stateUpdateDelays: generateMockData(),
      syncedUntil: UnixTime.now().toNumber(),
    }
    return acc
  }, {})

  return {
    ...result,
    optimism: {
      ...result.optimism!,
      syncedUntil: UnixTime.now().add(-2, 'days').toNumber(),
    },
  }
}

function generateMockData(): FinalityDataPoint {
  return {
    minimumInSeconds:
      generateRandomTime() < 3000 ? undefined : generateRandomTime(),
    averageInSeconds: generateRandomTime(),
    maximumInSeconds: generateRandomTime(),
  }
}

function generateRandomTime() {
  const i = Math.round(Math.random() * 100)
  if (i < 50) {
    return Math.round(Math.random() * 3600)
  }
  if (i < 90) {
    return 3600 + Math.round(Math.random() * 82800)
  }
  return 86400 + Math.round(Math.random() * 86400 * 5)
}
