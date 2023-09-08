import { Config } from './Config'
import { getProductionConfig } from './config.production'

export function getCIConfig(): Config {
  const config = getProductionConfig()
  config.backend.mock = true
  return config
}
