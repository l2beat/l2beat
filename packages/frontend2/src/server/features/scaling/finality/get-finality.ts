import { assert } from '@l2beat/backend-tools'
import { type Layer2FinalityConfig } from '@l2beat/config'
import { type Database } from '@l2beat/database'
import {
  type FinalityApiResponse,
  type ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { keyBy, mapValues, partition } from 'lodash'
import { db } from '~/server/database'
import { LivenessWithConfigService } from './LivenessWithConfigService'
import { calcAvgsPerProject } from './calcAvgsPerProject'
import { divideAndAddLag } from './divideAndAddLag'

export type FinalityProjectConfig = {
  projectId: ProjectId
} & Layer2FinalityConfig

export interface FinalityControllerDeps {
  db: Database
  projects: FinalityProjectConfig[]
}

export async function getFinality(
  projects: FinalityProjectConfig[],
): Promise<FinalityApiResponse> {
  const result: FinalityApiResponse['projects'] = {}

  const [OPStackProjects, otherProjects] = partition(
    projects,
    (p) => p.type === 'OPStack',
  )
  const OPStackFinality = await getOPStackFinality(OPStackProjects)
  Object.assign(result, OPStackFinality)

  const projectsFinality = await getProjectsFinality(otherProjects)
  Object.assign(result, projectsFinality)

  return {
    projects: result,
  }
}

async function getProjectsFinality(
  projects: FinalityProjectConfig[],
): Promise<FinalityApiResponse['projects']> {
  const projectIds = projects.map((p) => p.projectId)
  const records = await db.finality.getLatestGroupedByProjectId(projectIds)

  const result: FinalityApiResponse['projects'] = mapValues(
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
        syncedUntil: timestamp,
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
): Promise<FinalityApiResponse['projects']> {
  const result: FinalityApiResponse['projects'] = {}

  // TODO: Fix it using types from finality
  function toConfig(raw: string) {
    return JSON.parse(raw) as {
      projectId: ProjectId
      subtype: 'batchSubmissions' | 'stateUpdates' | 'proofSubmissions'
    }
  }
  const configurations = (
    await db.indexerConfiguration.getSavedConfigurations('tracked_txs_indexer')
  ).map((c) => ({
    ...c,
    properties: toConfig(c.properties),
  }))

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

      if (!configsToUse) return

      const syncedUntil = new UnixTime(
        Math.max(
          ...configsToUse
            .map((c) => c.currentHeight)
            .filter((h): h is number => h !== null),
        ),
      )

      if (!syncedUntil) return

      // TODO: (sz-piotr) Refactor as dependency!
      const livenessWithConfig = new LivenessWithConfigService(configsToUse, db)

      const records = await livenessWithConfig.getByTypeSince(
        'batchSubmissions',
        syncedUntil.add(-1, 'days'),
      )

      const intervals = calcAvgsPerProject(records)
      const projectResult = divideAndAddLag(intervals, project.lag)

      if (projectResult) {
        result[project.projectId.toString()] = {
          timeToInclusion: projectResult,
          stateUpdateDelays: null,
          syncedUntil,
        }
      }
    }),
  )
  return result
}
