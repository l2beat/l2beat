import { LogLevel } from '../services/Logger'
import { Config } from './Config'

export function getProductionConfig(): Config {
  return {
    name: 'Backend/Production',
    port: 3000,
    logLevel: LogLevel.INFO,
  }
}
