import Router from '@koa/router'
import { ChildIndexer } from '@l2beat/uif'

export interface ApplicationModule {
  routers?: Router[]
  start?: () => Promise<void> | void
  indexer?: ChildIndexer
}
