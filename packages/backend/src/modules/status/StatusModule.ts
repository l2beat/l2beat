import Router from '@koa/router'
import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../config/Config'
import { ApplicationModule } from '../ApplicationModule'
import { createStatusRouter } from './api/StatusRouter'

export function createStatusModule(
  config: Config,
  logger: Logger,
): ApplicationModule | undefined {
  if (!config.statusEnabled) {
    logger.info('StatusModule disabled')
    return
  }

  const routers: Router[] = [createStatusRouter()]

  const start = () => {
    logger = logger.for('StatusModule')
    logger.info('Started')
  }

  return {
    start,
    routers,
  }
}
