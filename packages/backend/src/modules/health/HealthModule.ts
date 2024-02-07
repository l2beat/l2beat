import { Config } from '../../config'
import { ApplicationModule } from '../ApplicationModule'
import { HealthController } from './api/HealthController'
import { createHealthRouter } from './api/HealthRouter'

export function createHealthModule(config: Config): ApplicationModule {
  const healthController = new HealthController(config.health)
  const healthRouter = createHealthRouter(healthController)
  return {
    routers: [healthRouter],
  }
}
