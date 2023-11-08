import { LivenessApiResponse } from '@l2beat/shared-pure'

import { LivenessRepository } from '../../../peripherals/database/LivenessRepository'
import { calculateAnomalies } from './calculateAnomalies'
import { calculateIntervalWithAverages } from './calculateIntervalWithAverages'
import { groupByProjectIdAndType } from './groupByProjectIdAndType'

export class LivenessController {
  constructor(private readonly livenessRepository: LivenessRepository) {}

  async getLiveness(): Promise<LivenessApiResponse> {
    const allRecords = await this.livenessRepository.getAll()
    const groupedByProjectAndType = groupByProjectIdAndType(allRecords)

    const intervals = calculateIntervalWithAverages(groupedByProjectAndType)
    const withAnomalies = calculateAnomalies(intervals)

    return LivenessApiResponse.parse({ projects: withAnomalies })
  }
}
