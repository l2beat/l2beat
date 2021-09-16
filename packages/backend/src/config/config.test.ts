import { LogLevel } from '../services/Logger'
import { Config } from './Config'

export function getTestConfig(): Config {
  return {
    name: 'Backend/Test',
    port: 3000,
    logLevel: LogLevel.NONE,
  }
}
