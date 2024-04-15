import Router from '@koa/router'
import { ChildIndexer } from '@l2beat/uif'

import { TxUpdaterInterface } from './tracked-txs/types/TxUpdaterInterface'

export interface ApplicationModule {
  routers?: Router[]
  start?: () => Promise<void> | void
  syncDisabled?: boolean
}

export interface ApplicationModuleWithIndexer<T extends ChildIndexer>
  extends ApplicationModule {
  indexer: T
}

export interface ApplicationModuleWithUpdater<T extends TxUpdaterInterface>
  extends ApplicationModule {
  updater: T
}
