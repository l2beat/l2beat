import { assert } from '@l2beat/backend-tools'
import { FinalityApiResponse, UnixTime } from '@l2beat/shared-pure'
import { keyBy, mapValues, partition } from 'lodash'
import { FinalityProjectConfig } from '../../../config/features/finality'
import { IndexerConfigurationRepository } from '../../../tools/uif/IndexerConfigurationRepository'
import { LivenessRepository } from '../../tracked-txs/modules/liveness/repositories/LivenessRepository'
import { FinalityRepository } from '../repositories/FinalityRepository'
import { calcAvgsPerProject } from './calcAvgsPerProject'
import { divideAndAddLag } from './divideAndAddLag'

export interface FinalityControllerDeps {
  livenessRepository: LivenessRepository
  finalityRepository: FinalityRepository
  indexerConfigurationRepository: IndexerConfigurationRepository
  projects: FinalityProjectConfig[]
}

export class FinalityController {
  constructor(private readonly $: FinalityControllerDeps) {}

  async getFinality(): Promise<FinalityApiResponse> {
    const projects: FinalityApiResponse['projects'] = {}

    const [OPStackProjects, otherProjects] = partition(
      this.$.projects,
      (p) => p.type === 'OPStack',
    )
    const OPStackFinality = await this.getOPStackFinality(OPStackProjects)
    Object.assign(projects, OPStackFinality)

    const projectsFinality = await this.getProjectsFinality(otherProjects)
    Object.assign(projects, projectsFinality)

    return { projects }
  }

  async getProjectsFinality(
    projects: FinalityProjectConfig[],
  ): Promise<FinalityApiResponse['projects']> {
    const projectIds = projects.map((p) => p.projectId)
    const records =
      await this.$.finalityRepository.getLatestGroupedByProjectId(projectIds)

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

  async getOPStackFinality(
    projects: FinalityProjectConfig[],
  ): Promise<FinalityApiResponse['projects']> {
    const result: FinalityApiResponse['projects'] = {}
    const configurations = (
      await this.$.indexerConfigurationRepository.getSavedConfigurations(
        'tracked_txs_indexer',
      )
    ).map((c) => ({
      ...c,
      properties: JSON.parse(c.properties),
    }))

    await Promise.all(
      projects.map(async (project) => {
        const syncedUntil = new UnixTime(
          Math.max(
            ...configurations
              .filter(
                (c) =>
                  c.properties.projectId === project.projectId &&
                  c.properties.subtype === 'batchSubmissions',
              )
              .map((c) => c.currentHeight)
              .filter((h): h is number => h !== null),
          ),
        )

        if (!syncedUntil) return

        const records = await this.$.livenessRepository.getByProjectIdAndType(
          project.projectId,
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
}
