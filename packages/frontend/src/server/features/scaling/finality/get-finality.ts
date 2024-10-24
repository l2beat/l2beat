import { type Layer2FinalityConfig } from '@l2beat/config'
import {
  assert,
  type ProjectId,
  type TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { keyBy, mapValues, partition } from 'lodash'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { env } from '~/env'
import { db } from '~/server/database'
import { type FinalityData, type FinalityDataPoint } from './schema'
import { calcAvgsPerProject } from './utils/calc-avgs-per-project'
import { divideAndAddLag } from './utils/divide-and-add-lag'
import { getLivenessByTypeSince } from './utils/get-liveness-by-type-since'

export type FinalityProjectConfig = {
  projectId: ProjectId
} & Layer2FinalityConfig

export async function getFinality(projects: FinalityProjectConfig[]) {
  if (env.MOCK) {
    return getMockFinalityApiResponse(projects)
  }
  noStore()
  return getCachedFinalityData(projects)
}

const getCachedFinalityData = cache(
  async (projects: FinalityProjectConfig[]) => {
    const result: FinalityData = {}

    const [OPStackProjects, otherProjects] = partition(
      projects,
      (p) => p.type === 'OPStack',
    )
    const OPStackFinality = await getOPStackFinality(OPStackProjects)
    Object.assign(result, OPStackFinality)

    const projectsFinality = await getProjectsFinality(otherProjects)
    Object.assign(result, projectsFinality)

    return result
  },
  ['finality'],
  {
    revalidate: UnixTime.HOUR,
  },
)

async function getProjectsFinality(
  projects: FinalityProjectConfig[],
): Promise<FinalityData> {
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

async function getOPStackFinality(
  projects: FinalityProjectConfig[],
): Promise<FinalityData> {
  const result: FinalityData = {}

  const configurations = await getLatestConfigurations()

  await Promise.all(
    projects.map(async (project) => {
      const configsToUse = configurations
        .filter(
          (c) =>
            c.properties.projectId === project.projectId &&
            c.properties.subtype === 'batchSubmissions',
        )
        .map((c) => ({
          id: c.id,
          subtype: c.properties.subtype,
          currentHeight: c.currentHeight,
        }))

      if (!configsToUse) {
        return
      }

      const syncedUntil = new UnixTime(
        Math.max(
          ...configsToUse
            .map((c) => c.currentHeight)
            .filter((h): h is number => h !== null),
        ),
      )

      if (!syncedUntil) {
        return
      }

      const records = await getLivenessByTypeSince(
        configsToUse,
        'batchSubmissions',
        syncedUntil.add(-1, 'days'),
      )

      const intervals = calcAvgsPerProject(records)
      const projectResult = divideAndAddLag(intervals, project.lag)

      if (projectResult) {
        result[project.projectId.toString()] = {
          timeToInclusion: projectResult,
          stateUpdateDelays: null,
          syncedUntil: syncedUntil.toNumber(),
        }
      }
    }),
  )
  return result
}

async function getLatestConfigurations() {
  function coerce(raw: string) {
    return JSON.parse(raw) as {
      projectId: ProjectId
      subtype: TrackedTxsConfigSubtype
    }
  }

  const configurations = (
    await db.indexerConfiguration.getByIndexerId('tracked_txs_indexer')
  ).map((c) => ({
    ...c,
    properties: coerce(c.properties),
  }))
  return configurations
}

function getMockFinalityApiResponse(
  projects: FinalityProjectConfig[],
): FinalityData {
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
