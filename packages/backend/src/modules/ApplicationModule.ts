import type Router from '@koa/router'
import type { ChildIndexer } from '@l2beat/uif'

import type { TxUpdaterInterface } from './tracked-txs/types/TxUpdaterInterface'

export interface ApplicationModule {
  routers?: Router[]
  start?: () => Promise<void> | void
}

export interface ApplicationModuleWithIndexer<T extends ChildIndexer>
  extends ApplicationModule {
  indexer: T
}

export interface ApplicationModuleWithUpdater<T extends TxUpdaterInterface>
  extends ApplicationModule {
  updater: T
}
