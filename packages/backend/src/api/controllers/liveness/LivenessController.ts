import { LivenessApiResponse } from '@l2beat/shared-pure'

import { LivenessRepository } from '../../../peripherals/database/LivenessRepository'

export class LivenessController {
  constructor(private readonly livenessRepository: LivenessRepository) {}

  async getLiveness(): Promise<LivenessApiResponse> {
    // get all the record
    // aggregate them by project
    // function for calculating intervals
    // function for getting averages
    // function for getting anomalies
  }
}
