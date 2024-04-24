import { FinalityApiResponse } from '@l2beat/shared-pure'
import { keyBy, mapValues, partition } from 'lodash'

import { FinalityProjectConfig } from '../../../config/features/finality'
import { LivenessRepository } from '../../tracked-txs/modules/liveness/repositories/LivenessRepository'
import { TrackedTxsConfigsRepository } from '../../tracked-txs/repositories/TrackedTxsConfigsRepository'
import { FinalityRepository } from '../repositories/FinalityRepository'
import { calcAvgsPerProject } from './calcAvgsPerProject'
import { divideAndAddLag } from './divideAndAddLag'

export class FinalityController {
  constructor(
    private readonly livenessRepository: LivenessRepository,
    private readonly finalityRepository: FinalityRepository,
    private readonly trackedTxsConfigsRepository: TrackedTxsConfigsRepository,
    private readonly projects: FinalityProjectConfig[],
  ) {}

  async getFinality(): Promise<FinalityApiResponse> {
    const projects: FinalityApiResponse['projects'] = {}

    const [OPStackProjects, otherProjects] = partition(
      this.projects,
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
      await this.finalityRepository.getLatestGroupedByProjectId(projectIds)

    const result: FinalityApiResponse['projects'] = mapValues(
      keyBy(records, 'projectId'),
      (record) => {
        const base = {
          timeToInclusion: {
            minimumInSeconds: record.minimumTimeToInclusion,
            maximumInSeconds: record.maximumTimeToInclusion,
            averageInSeconds: record.averageTimeToInclusion,
          },
          syncedUntil: record.timestamp,
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const project = projects.find(
          (project) => project.projectId === record.projectId,
        )!

        if (project.stateUpdate === 'zeroed') {
          return {
            ...base,
            stateUpdate: {
              minimumInSeconds: 0,
              maximumInSeconds: 0,
              averageInSeconds: 0,
            },
          }
        }

        const stateUpdate =
          record.maximumStateUpdate !== null &&
          record.minimumStateUpdate !== null &&
          record.averageStateUpdate !== null
            ? {
                minimumInSeconds:
                  record.minimumStateUpdate - record.minimumTimeToInclusion,
                maximumInSeconds:
                  record.maximumStateUpdate - record.maximumTimeToInclusion,
                averageInSeconds:
                  record.averageStateUpdate - record.averageTimeToInclusion,
              }
            : null

        return {
          ...base,
          stateUpdate,
        }
      },
    )

    return result
  }

  async getOPStackFinality(
    projects: FinalityProjectConfig[],
  ): Promise<FinalityApiResponse['projects']> {
    const result: FinalityApiResponse['projects'] = {}
    await Promise.all(
      projects.map(async (project) => {
        const syncedUntil =
          await this.trackedTxsConfigsRepository.findLatestSyncedTimestampByProjectIdAndSubtype(
            project.projectId,
            'batchSubmissions',
          )

        if (!syncedUntil) return

        const records = await this.livenessRepository.getByProjectIdAndType(
          project.projectId,
          'batchSubmissions',
          syncedUntil.add(-1, 'days'),
        )

        const intervals = calcAvgsPerProject(records)
        const projectResult = divideAndAddLag(intervals, project.lag)

        if (projectResult) {
          result[project.projectId.toString()] = {
            timeToInclusion: projectResult,
            stateUpdate: null,
            syncedUntil,
          }
        }
      }),
    )
    return result
  }
}
