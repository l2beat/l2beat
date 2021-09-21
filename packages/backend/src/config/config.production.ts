import { LogLevel } from '../services/Logger'
import { Config } from './Config'
import { getEnv } from './getEnv'

export function getProductionConfig(): Config {
  return {
    name: 'Backend/Production',
    logLevel: LogLevel.INFO,
    port: getEnv.integer('PORT'),
  }
}
