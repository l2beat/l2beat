import Router from '@koa/router'

export interface ApplicationModule {
  routers?: Router[]
  start?: () => Promise<void> | void
}
