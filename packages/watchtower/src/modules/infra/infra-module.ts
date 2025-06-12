import type { Logger } from '@l2beat/backend-tools'
import type { ApplicationModule } from '../../module'
import { InfrastructureController } from './infra-controller'
import { createInfrastructureRouter } from './infra-router'
import type { Config } from '../../config/types'

type InfrastructureModuleDependencies = {
  logger: Logger
  config: Config
}

export function createInfrastructureModule(
  dependencies: InfrastructureModuleDependencies,
): ApplicationModule {
  const logger = dependencies.logger.for('Infrastructure')
  const controller = new InfrastructureController(dependencies)
  console.log('Config', dependencies.config)
  const router = createInfrastructureRouter(controller, dependencies.config)

  return {
    routers: [router],
    start: () => {
      logger.info('Started')
    },
  }
}
