import type { Database } from '@l2beat/database'
import type { DataAvailabilityTrackingConfig } from '../../config/Config'
import type { Providers } from '../../providers/Providers'

export class DataAvailabilityDependencies {
  constructor(
    readonly config: DataAvailabilityTrackingConfig,
    readonly database: Database,
    readonly providers: Providers,
  ) {}
}
