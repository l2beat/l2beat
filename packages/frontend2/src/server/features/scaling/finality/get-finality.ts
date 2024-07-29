import { assert } from '@l2beat/backend-tools'
import { type Layer2FinalityConfig } from '@l2beat/config'
import {
  type ProjectId,
  type TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { keyBy, mapValues, partition } from 'lodash'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { db } from '~/server/database'
import { calcAvgsPerProject } from './calc-avgs-per-project'
import { divideAndAddLag } from './divide-and-add-lag'
import { getLivenessByTypeSince } from './get-liveness-by-type-since'
import { FinalityData, type SerializableFinalityData } from './schema'

export type FinalityProjectConfig = {
  projectId: ProjectId
} & Layer2FinalityConfig

export async function getFinality(projects: FinalityProjectConfig[]) {
  noStore()
  const cached = await getCachedFinalityData(projects)

  return FinalityData.parse(cached)
}

const getCachedFinalityData = cache(getFinalityData, ['finality'], {
  revalidate: 60 * 60,
})

export async function getFinalityData(
  projects: FinalityProjectConfig[],
): Promise<SerializableFinalityData> {
  const result: SerializableFinalityData = {}

  const [OPStackProjects, otherProjects] = partition(
    projects,
    (p) => p.type === 'OPStack',
  )
  const OPStackFinality = await getOPStackFinality(OPStackProjects)
  Object.assign(result, OPStackFinality)

  const projectsFinality = await getProjectsFinality(otherProjects)
  Object.assign(result, projectsFinality)

  return result
}

async function getProjectsFinality(
  projects: FinalityProjectConfig[],
): Promise<SerializableFinalityData> {
  const projectIds = projects.map((p) => p.projectId)
  const records = await db.finality.getLatestGroupedByProjectId(projectIds)

  const result: SerializableFinalityData = mapValues(
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
            averageInSeconds: averageStateUpdate - averageTimeToInclusion,
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
): Promise<SerializableFinalityData> {
  const result: SerializableFinalityData = {}

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
          syncedUntil: syncedUntil.toNumber(), // cache serialization, will be coerced to UnixTime
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
