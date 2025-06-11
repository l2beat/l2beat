import type express from 'express'

export interface ApplicationModule {
  routers?: express.Router[]
  start?: () => Promise<void> | void
}
