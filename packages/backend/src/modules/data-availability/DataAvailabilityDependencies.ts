import type { Database } from '@l2beat/database'
import type { Providers } from '../../providers/Providers'

export class DataAvailabilityDependencies {
  constructor(
    private readonly _config: unknown,
    readonly database: Database,
    private readonly _providers: Providers,
  ) {}
}
