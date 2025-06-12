import type { Logger } from '@l2beat/backend-tools'
import type { ApplicationModule } from '../../module'
import { InfrastructureController } from './infra-controller'
import { createInfrastructureRouter } from './infra-router'

type InfrastructureModuleDependencies = {
  logger: Logger
}

export function createInfrastructureModule(
  dependencies: InfrastructureModuleDependencies,
): ApplicationModule {
  const logger = dependencies.logger.for('Infrastructure')
  const controller = new InfrastructureController(dependencies)
  const router = createInfrastructureRouter(controller)

  return {
    routers: [router],
    start: () => {
      logger.info('Started')
    },
  }
}
