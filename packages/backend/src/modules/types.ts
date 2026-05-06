import type Router from '@koa/router'
import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { Block, Log } from '@l2beat/shared-pure'
import type { AnyTRPCRouter } from '@trpc/server'
import type { Config } from '../config'
import type { Providers } from '../providers/Providers'
import type { Clock } from '../tools/Clock'

export interface TrpcContribution<
  N extends string = string,
  R extends AnyTRPCRouter = AnyTRPCRouter,
> {
  namespace: N
  trpcRouter: R
}

export interface ApplicationModule {
  routers?: Router[]
  trpc?: TrpcContribution
  start?: () => Promise<void> | void
}

export interface ModuleDependencies {
  config: Config
  logger: Logger
  clock: Clock
  providers: Providers
  db: Database
  blockProcessors: BlockProcessor[]
}

export interface BlockProcessor {
  chain: string
  processBlock(block: Block, logs: Log[]): Promise<void>
}
