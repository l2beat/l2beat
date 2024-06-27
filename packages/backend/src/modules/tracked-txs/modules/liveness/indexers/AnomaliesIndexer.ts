import { UnixTime, clampRangeToDay } from '@l2beat/shared-pure'
import { Project } from '../../../../../model/Project'
import {
  ManagedChildIndexer,
  ManagedChildIndexerOptions,
} from '../../../../../tools/uif/ManagedChildIndexer'
import { getProjectsToSync } from '../../utils/getProjectsToSync'
import {
  AnomaliesRecord,
  AnomaliesRepository,
} from '../repositories/AnomaliesRepository'
import { LivenessRepository } from '../repositories/LivenessRepository'

export interface AnomaliesIndexerIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  livenessRepository: LivenessRepository
  anomaliesRepository: AnomaliesRepository
  projects: Project[]
}

export class AnomaliesIndexer extends ManagedChildIndexer {
  constructor(private readonly $: AnomaliesIndexerIndexerDeps) {
    super({ ...$, name: 'anomalies' })
  }

  override async update(from: number, to: number): Promise<number> {
    // limit time range to one day if greater
    const { from: unixFrom, to: unixTo } = clampRangeToDay(from, to)

    // we need data from 30 days past to calcualate standard deviation
    const deviationRange = unixFrom.add(-30, 'days').toStartOf('day')

    if (deviationRange.toNumber() < this.options.minHeight) {
      this.logger.info('Not enough data to calculate anomalies', {
        deviationRange,
      })
    }

    this.logger.info('Calculating anomalies', { deviationRange, unixTo })

    const anomalies = await this.calculateAnomalies(
      deviationRange,
      unixFrom,
      unixTo,
    )

    await this.$.anomaliesRepository.addOrUpdateMany(anomalies)

    return to
  }

  override async invalidate(targetHeight: number): Promise<number> {
    // no need to remove data
    // safeHeight will be updated to this value
    return await Promise.resolve(targetHeight)
  }

  async calculateAnomalies(
    deviationRange: UnixTime,
    from: UnixTime,
    to: UnixTime,
  ) {
    const anomalies: AnomaliesRecord[] = []
    const projectsToSync = getProjectsToSync(this.$.projects)

    this.logger.info('Params', { deviationRange, from, to, projectsToSync })

    return await Promise.resolve(anomalies)
  }
}
