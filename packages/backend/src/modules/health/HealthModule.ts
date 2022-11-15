import { HealthController } from '../../api/controllers/HealthController'
import { createHealthRouter } from '../../api/routers/HealthRouter'
import { Config } from '../../config'

export function createHealthModule(config: Config) {
  const healthController = new HealthController(config.health)
  const healthRouter = createHealthRouter(healthController)
  return {
    routers: [healthRouter],
  }
}
