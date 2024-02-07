import {
  FinalityApiResponse,
  LivenessType,
  UnixTime,
} from '@l2beat/shared-pure'

import { Clock } from '../../../core/Clock'
import { LivenessRepository } from '../../../liveness/repositories/LivenessRepository'
import { Project } from '../../../model'
import { IndexerStateRepository } from '../../../peripherals/database/IndexerStateRepository'
import { calcAvgsPerProject } from './calcAvgsPerProject'
import { divideAndAddLag } from './divideAndAddLag'

type FinalityResult =
  | {
      type: 'success'
      data: FinalityApiResponse
    }
  | {
      type: 'error'
      error: 'DATA_NOT_SYNCED'
    }

export class FinalityController {
  constructor(
    private readonly livenessRepository: LivenessRepository,
    private readonly indexerStateRepository: IndexerStateRepository,
    private readonly projects: Project[],
    private readonly clock: Clock,
  ) {}

  async getFinality(): Promise<FinalityResult> {
    const requiredTimestamp = this.clock.getLastHour().add(-1, 'hours')
    const indexerState = await this.indexerStateRepository.findIndexerState(
      'liveness_indexer',
    )
    if (
      indexerState === undefined ||
      new UnixTime(indexerState.safeHeight).lt(requiredTimestamp)
    ) {
      return { type: 'error', error: 'DATA_NOT_SYNCED' }
    }

    const projects: FinalityApiResponse['projects'] = {}

    const OPStackProjects = this.projects.filter(
      (p) => !p.isArchived && p.finalityConfig?.type === 'OPStack',
    )
    const OPStackFinality = await this.getOPStackFinality(OPStackProjects)
    Object.assign(projects, OPStackFinality)

    return { type: 'success', data: { projects } }
  }

  async getOPStackFinality(
    projects: Project[],
  ): Promise<FinalityApiResponse['projects']> {
    const result: FinalityApiResponse['projects'] = {}
    await Promise.all(
      projects.map(async (project) => {
        if (project.finalityConfig === undefined) {
          return
        }
        const records = await this.livenessRepository.getByProjectIdAndType(
          project.projectId,
          LivenessType('DA'),
          UnixTime.now().add(-30, 'days'),
        )

        const intervals = calcAvgsPerProject(records)
        const projectResult = divideAndAddLag(
          intervals,
          project.finalityConfig.lag,
        )
        if (projectResult) {
          result[project.projectId.toString()] = projectResult
        }
      }),
    )
    return result
  }
}
