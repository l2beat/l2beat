import type { Database } from '@l2beat/database'
import type { CoingeckoClient } from '@l2beat/shared'
import type { EcosystemTokenConfig } from '../../config/Config'
import type { ManagedChildIndexerOptions } from '../../tools/uif/ManagedChildIndexer'

export interface EcosystemTokenIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  tokenConfig: EcosystemTokenConfig
  coingeckoClient: CoingeckoClient
}
