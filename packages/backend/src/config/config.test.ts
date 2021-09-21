import { LogLevel } from '../services/Logger'
import { Config } from './Config'

export function getTestConfig(): Config {
  return {
    name: 'Backend/Test',
    logLevel: LogLevel.NONE,
    port: 1337,
  }
}
