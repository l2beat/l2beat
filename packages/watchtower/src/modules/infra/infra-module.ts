import type { Logger } from '@l2beat/backend-tools'
import type { ApplicationModule } from '../../module'
import { InfrastructureController } from './infra-controller'
import { createInfrastructureRouter } from './infra-router'
import type { Config } from '../../config/types'
import { PreviewManager } from '../preview-manager'

type InfrastructureModuleDependencies = {
  logger: Logger
  config: Config
}

export function createInfrastructureModule(
  dependencies: InfrastructureModuleDependencies,
): ApplicationModule {
  const logger = dependencies.logger.for('Infrastructure')
  const previewManager = new PreviewManager({ app: 'frontend' })

  const controller = new InfrastructureController({
    logger,
    previewManager,
  })
  const router = createInfrastructureRouter(controller, dependencies.config)

  return {
    routers: [router],
    start: () => {
      logger.info('Started')
    },
  }
}
