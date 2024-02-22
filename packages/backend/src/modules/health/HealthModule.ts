import { Config } from '../../config'
import { ApplicationModule } from '../ApplicationModule'
import { HealthController } from './HealthController'
import { createHealthRouter } from './HealthRouter'

export function createHealthModule(config: Config): ApplicationModule {
  const healthController = new HealthController(config.health)
  const healthRouter = createHealthRouter(healthController)
  return {
    routers: [healthRouter],
  }
}
