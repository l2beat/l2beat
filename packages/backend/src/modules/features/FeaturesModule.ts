import { Config } from '../../config'
import { ApplicationModule } from '../ApplicationModule'
import { FeaturesController } from './FeaturesController'
import { createFeaturesRouter } from './FeaturesRouter'

export function createFeaturesModule(config: Config): ApplicationModule {
  const controller = new FeaturesController(config.flags)
  const router = createFeaturesRouter(controller)
  return {
    routers: [router],
  }
}
