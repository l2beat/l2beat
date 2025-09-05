import type Router from '@koa/router'
import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { Block, Log } from '@l2beat/shared-pure'
import type { Config } from '../config'
import type { Peripherals } from '../peripherals/Peripherals'
import type { Providers } from '../providers/Providers'
import type { Clock } from '../tools/Clock'

export interface ApplicationModule {
  routers?: Router[]
  start?: () => Promise<void> | void
}

export interface ModuleDependencies {
  config: Config
  logger: Logger
  clock: Clock
  providers: Providers
  peripherals: Peripherals
  db: Database
  blockProcessors: BlockProcessor[]
}

export interface BlockProcessor {
  chain: string
  processBlock(block: Block, logs: Log[]): Promise<void>
}
