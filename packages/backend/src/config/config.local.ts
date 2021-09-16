import { LogLevel } from '../services/Logger'
import { Config } from './Config'

export function getLocalConfig(): Config {
  return {
    name: 'Backend/Local',
    port: 3000,
    logLevel: LogLevel.INFO,
  }
}
